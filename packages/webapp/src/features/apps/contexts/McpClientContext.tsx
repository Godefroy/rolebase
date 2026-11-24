import { ApiKeyFragment } from '@gql'
import { createContext } from 'react'

export interface McpClientContextValue {
  serverUrl: string
  apiKeys: ApiKeyFragment[]
  loading: boolean
  selectedApiKey: ApiKeyFragment | undefined
  setSelectedApiKeyId: (id: string) => void
}

export const McpClientContext = createContext<
  McpClientContextValue | undefined
>(undefined)
