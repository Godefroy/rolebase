import { z } from 'zod'
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import type { RolebaseClient } from '../client.js'
import type { ToolRegistrar } from './types.js'

export const registerGraphQLTool: ToolRegistrar = (server, client) => {
  server.tool(
    'graphql',
    'Execute an arbitrary GraphQL query or mutation against the Rolebase Hasura API. Use this for any operation not covered by the dedicated tools. The API uses Hasura conventions: table queries return data in format { tableName: [...rows] } or { tableName_by_pk: {...row} }. Mutations use insert_<table>_one, update_<table>_one, etc.',
    {
      query: z.string().describe('The GraphQL query or mutation string'),
      variables: z
        .record(z.unknown())
        .optional()
        .describe('Optional GraphQL variables as a JSON object'),
    },
    async ({ query, variables }) => {
      try {
        const data = await client.query(query, variables)
        return {
          content: [
            {
              type: 'text' as const,
              text: JSON.stringify(data, null, 2),
            },
          ],
        }
      } catch (error) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `Error: ${error instanceof Error ? error.message : String(error)}`,
            },
          ],
          isError: true,
        }
      }
    }
  )
}
