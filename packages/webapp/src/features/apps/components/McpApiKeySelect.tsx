import { useAuth } from '@/user/hooks/useAuth'
import {
  Button,
  Card,
  CardBody,
  FormControl,
  FormHelperText,
  FormLabel,
  Select,
  Text,
  useToast,
} from '@chakra-ui/react'
import { useCreateApiKeyMutation } from '@gql'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import useMcpClient from '../hooks/useMcpClient'

export default function McpApiKeySelect() {
  const { t } = useTranslation()
  const toast = useToast()
  const { user } = useAuth()
  const { apiKeys, loading, selectedApiKey, setSelectedApiKeyId } =
    useMcpClient()
  const [createApiKey] = useCreateApiKeyMutation()
  const [isCreating, setIsCreating] = useState(false)

  const handleCreate = async () => {
    if (!user) return
    setIsCreating(true)
    try {
      const { data } = await createApiKey({
        variables: { userId: user.id, name: t('McpPage.newKeyName') },
      })
      const id = data?.insert_api_key_one?.id
      if (id) setSelectedApiKeyId(id)
    } catch (error) {
      console.error(error)
      toast({
        title: t('common.error'),
        description: t('common.errorRetry'),
        status: 'error',
      })
    }
    setIsCreating(false)
  }

  if (loading) return null

  return (
    <Card>
      <CardBody>
        {apiKeys.length === 0 ? (
          <>
            <Text mb={3}>{t('McpPage.noKey')}</Text>
            <Button
              size="sm"
              colorScheme="blue"
              isLoading={isCreating}
              onClick={handleCreate}
            >
              {t('McpPage.createKey')}
            </Button>
          </>
        ) : (
          <FormControl>
            <FormLabel>{t('McpPage.apiKey')}</FormLabel>
            <Select
              size="sm"
              value={selectedApiKey?.id}
              onChange={(e) => setSelectedApiKeyId(e.target.value)}
            >
              {apiKeys.map((apiKey) => (
                <option key={apiKey.id} value={apiKey.id}>
                  {apiKey.name}
                </option>
              ))}
            </Select>
            <FormHelperText>{t('McpPage.keyHelp')}</FormHelperText>
          </FormControl>
        )}
      </CardBody>
    </Card>
  )
}
