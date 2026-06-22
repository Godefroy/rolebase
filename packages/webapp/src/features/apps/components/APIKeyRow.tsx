import PasswordInput from '@/common/atoms/PasswordInput'
import {
  Flex,
  IconButton,
  Input,
  Td,
  Tooltip,
  Tr,
  useClipboard,
  useToast,
} from '@chakra-ui/react'
import {
  ApiKeyFragment,
  useArchiveApiKeyMutation,
  useRenameApiKeyMutation,
} from '@gql'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { CopyIcon, DeleteIcon } from 'src/icons'

interface APIKeyRowProps {
  apiKey: ApiKeyFragment
}

export default function APIKeyRow({ apiKey }: APIKeyRowProps) {
  const { t } = useTranslation()
  const toast = useToast()

  // State
  const [newName, setNewName] = useState(apiKey.name)

  // Copy functionality
  const { onCopy, hasCopied } = useClipboard(apiKey.value)

  useEffect(() => {
    if (hasCopied) {
      toast({
        title: t('APIKeyRow.copyToast'),
        status: 'info',
        duration: 1500,
      })
    }
  }, [hasCopied])

  useEffect(() => {
    setNewName(apiKey.name)
  }, [apiKey.name])

  // Mutations
  const [renameApiKey] = useRenameApiKeyMutation()
  const [archiveApiKey] = useArchiveApiKeyMutation()

  const handleUpdateName = async () => {
    if (newName === apiKey.name) return
    try {
      await renameApiKey({
        variables: { id: apiKey.id, name: newName },
      })

      toast({
        title: t('APIKeyRow.renameSuccess'),
        status: 'success',
      })
    } catch (error) {
      console.error(error)
      toast({
        title: t('common.error'),
        description: t('common.errorRetry'),
        status: 'error',
      })
    }
  }

  const handleDelete = async () => {
    if (!confirm(t('APIKeyRow.deleteConfirm', { name: apiKey.name }))) return
    try {
      await archiveApiKey({
        variables: { id: apiKey.id, archivedAt: new Date().toISOString() },
      })

      toast({
        title: t('APIKeyRow.deleteSuccess'),
        status: 'success',
      })
    } catch (error) {
      console.error(error)
      toast({
        title: t('common.error'),
        description: t('common.errorRetry'),
        status: 'error',
      })
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      ;(e.target as HTMLInputElement).blur()
    }
  }

  return (
    <Tr>
      <Td w="200px">
        <Input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onBlur={handleUpdateName}
          onKeyDown={handleKeyDown}
          size="sm"
        />
      </Td>
      <Td>
        <PasswordInput value={apiKey.value} isReadOnly size="sm" />
      </Td>
      <Td w="1%" whiteSpace="nowrap" textAlign="right">
        <Flex gap={1} justifyContent="flex-end">
          <Tooltip label={t('common.copy')} placement="bottom" hasArrow>
            <IconButton
              aria-label={t('common.copy')}
              icon={<CopyIcon size={20} />}
              size="sm"
              variant="ghost"
              onClick={onCopy}
            />
          </Tooltip>
          <Tooltip label={t('common.delete')} placement="bottom" hasArrow>
            <IconButton
              aria-label={t('common.delete')}
              icon={<DeleteIcon size={20} />}
              size="sm"
              colorScheme="red"
              variant="ghost"
              onClick={handleDelete}
            />
          </Tooltip>
        </Flex>
      </Td>
    </Tr>
  )
}
