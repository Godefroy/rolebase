import { useContext } from 'react'
import { McpClientContext } from '../contexts/McpClientContext'

export default function useMcpClient() {
  const context = useContext(McpClientContext)
  if (!context) {
    throw new Error('useMcpClient must be used within McpClientProvider')
  }
  return context
}
