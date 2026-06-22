import { useAuth } from '@/user/hooks/useAuth'
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Flex,
  Input,
  Table,
  TableContainer,
  Tbody,
  Text,
  Th,
  Thead,
  Tr,
  useToast,
} from '@chakra-ui/react'
import { useApiKeysSubscription, useCreateApiKeyMutation } from '@gql'
import React, { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import APIKeyRow from './APIKeyRow'

export default function APICard() {
  const { t } = useTranslation()
  const toast = useToast()
  const { user } = useAuth()

  // Subscribe to API keys
  const { data } = useApiKeysSubscription({
    skip: !user,
    variables: {
      userId: user?.id!,
    },
  })
  const apiKeys = data?.api_key || []

  // Mutations
  const [createApiKey] = useCreateApiKeyMutation()

  // State
  const [isCreating, setIsCreating] = useState(false)
  const [newKeyName, setNewKeyName] = useState('')
  const newKeyInputRef = useRef<HTMLInputElement>(null)

  const handleCreateKey = async () => {
    if (!newKeyName || !user) return

    try {
      await createApiKey({
        variables: {
          userId: user.id,
          name: newKeyName,
        },
      })

      setNewKeyName('')
      setIsCreating(false)
      toast({
        title: t('APICard.createSuccess'),
        status: 'success',
      })
    } catch (error) {
      toast({
        title: t('common.error'),
        description: t('common.errorRetry'),
        status: 'error',
      })
    }
  }

  const handleCancel = () => {
    setNewKeyName('')
    setIsCreating(false)
  }

  const handleEnterKey = (action: () => void) => (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      action()
    }
  }

  React.useEffect(() => {
    if (isCreating) {
      // Focus the input on next render after it's shown
      setTimeout(() => {
        newKeyInputRef.current?.focus()
      }, 0)
    }
  }, [isCreating])

  return (
    <Card>
      <CardBody px={0}>
        {apiKeys.length === 0 ? (
          <Text color="gray.500" px="var(--card-padding)">
            {t('APICard.empty')}
          </Text>
        ) : (
          <TableContainer>
            <Table size="sm">
              <Thead>
                <Tr>
                  <Th>{t('APICard.colName')}</Th>
                  <Th>{t('APICard.colKey')}</Th>
                  <Th />
                </Tr>
              </Thead>
              <Tbody>
                {apiKeys.map((apiKey) => (
                  <APIKeyRow key={apiKey.id} apiKey={apiKey} />
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        )}
      </CardBody>

      <CardFooter pt={0}>
        {isCreating ? (
          <Flex gap={3} w="100%">
            <Input
              ref={newKeyInputRef}
              placeholder={t('APICard.keyNamePlaceholder')}
              value={newKeyName}
              onChange={(e) => setNewKeyName(e.target.value)}
              onKeyDown={handleEnterKey(handleCreateKey)}
              size="sm"
            />
            <Button size="sm" colorScheme="blue" onClick={handleCreateKey}>
              {t('common.create')}
            </Button>
            <Button size="sm" variant="ghost" onClick={handleCancel}>
              {t('common.cancel')}
            </Button>
          </Flex>
        ) : (
          <Button size="sm" onClick={() => setIsCreating(true)}>
            {t('APICard.createKey')}
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
