import { useAuth } from '@/user/hooks/useAuth'
import { useApiKeysSubscription } from '@gql'
import React, { ReactNode, useMemo, useState } from 'react'
import settings from 'src/settings'
import { McpClientContext } from './McpClientContext'

interface Props {
  children: ReactNode
}

export default function McpClientProvider({ children }: Props) {
  const { user } = useAuth()
  const { data, loading } = useApiKeysSubscription({
    skip: !user,
    variables: { userId: user?.id! },
  })
  const [selectedApiKeyId, setSelectedApiKeyId] = useState<string>()

  const value = useMemo(() => {
    // Latest key first
    const apiKeys = [...(data?.api_key || [])].sort((a, b) =>
      b.createdAt.localeCompare(a.createdAt)
    )
    return {
      serverUrl: settings.backendUrl,
      apiKeys,
      loading,
      selectedApiKey:
        apiKeys.find((apiKey) => apiKey.id === selectedApiKeyId) ?? apiKeys[0],
      setSelectedApiKeyId,
    }
  }, [data, loading, selectedApiKeyId])

  return (
    <McpClientContext.Provider value={value}>
      {children}
    </McpClientContext.Provider>
  )
}
