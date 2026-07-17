import { z } from 'zod'
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import type { RolebaseClient } from '../client.js'
import type { ToolRegistrar } from './types.js'

export const registerActivityTools: ToolRegistrar = (server, client) => {
  server.tool(
    'get_recent_activities',
    'List recent activities across all threads in an organization or circle. Returns messages, proposals, proposal events, and meeting notes in chronological order.',
    {
      orgId: z.string().uuid().describe('The organization ID'),
      circleId: z
        .string()
        .uuid()
        .optional()
        .describe('Optional circle ID to filter activities for a specific circle'),
      limit: z
        .number()
        .int()
        .min(1)
        .max(100)
        .optional()
        .default(20)
        .describe('Max activities to return (default 20)'),
    },
    async ({ orgId, circleId, limit }) => {
      try {
        const where: Record<string, unknown> = {
          thread: { orgId: { _eq: orgId } },
        }
        if (circleId) {
          where.thread = { ...where.thread as Record<string, unknown>, circleId: { _eq: circleId } }
        }

        const query = `query recentActivities($where: thread_activity_bool_exp!, $limit: Int) {
  thread_activity(where: $where, order_by: { createdAt: desc }, limit: $limit) {
    id
    type
    userId
    createdAt
    data
    thread {
      id
      title
      status
      circleId
      circle { role { name } }
    }
  }
}`

        const data = await client.query(query, { where, limit })
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
