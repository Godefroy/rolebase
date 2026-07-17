import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import type { RolebaseClient } from '../client.js'

export type ToolRegistrar = (server: McpServer, client: RolebaseClient) => void
