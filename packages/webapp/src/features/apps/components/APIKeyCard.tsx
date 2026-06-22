import PasswordInput from '@/common/atoms/PasswordInput'
import {
  Flex,
  IconButton,
  Input,
  Tooltip,
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

interface APIKeyCardProps {
  apiKey: ApiKeyFragment
}

export default function APIKeyCard({ apiKey }: APIKeyCardProps) {
  const { t } = useTranslation()
  const toast = useToast()

  // State
  const [newName, setNewName] = useState(apiKey.name)

  // Copy functionality
  const { onCopy, hasCopied } = useClipboard(apiKey.value)

  useEffect(() => {
    if (hasCopied) {
      toast({
        title: t('APIKeyCard.copyToast'),
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
        title: t('APIKeyCard.renameSuccess'),
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
    if (!confirm(t('APIKeyCard.deleteConfirm', { name: apiKey.name }))) return
    try {
      await archiveApiKey({
        variables: { id: apiKey.id, archivedAt: new Date().toISOString() },
      })

      toast({
        title: t('APIKeyCard.deleteSuccess'),
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
    <Flex alignItems="center" gap={3}>
      <Input
        value={newName}
        onChange={(e) => setNewName(e.target.value)}
        onBlur={handleUpdateName}
        onKeyDown={handleKeyDown}
        size="sm"
        maxW="200px"
      />
      <PasswordInput value={apiKey.value} isReadOnly size="sm" flex={1} />
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
  )
}
