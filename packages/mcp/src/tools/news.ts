import { z } from 'zod'
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import type { RolebaseClient } from '../client.js'
import type { ToolRegistrar } from './types.js'

export const registerNewsTools: ToolRegistrar = (server, client) => {
  server.tool(
    'get_news',
    'List the news feed (threads, decisions, meetings) for an organization or a specific circle. Returns a unified chronological feed. Only ended meetings and non-archived threads/decisions appear.',
    {
      orgId: z.string().uuid().describe('The organization ID'),
      circleId: z
        .string()
        .uuid()
        .optional()
        .describe('Optional circle ID to filter news for a specific circle'),
      limit: z
        .number()
        .int()
        .min(1)
        .max(100)
        .optional()
        .default(20)
        .describe('Max items to return (default 20)'),
      offset: z
        .number()
        .int()
        .min(0)
        .optional()
        .default(0)
        .describe('Offset for pagination (default 0)'),
    },
    async ({ orgId, circleId, limit, offset }) => {
      try {
        const where: Record<string, unknown> = { orgId: { _eq: orgId } }
        if (circleId) {
          where.circleId = { _eq: circleId }
        }

        const query = `query lastNews($where: news_bool_exp!, $limit: Int, $offset: Int) {
  news(where: $where, order_by: { createdAt: desc }, limit: $limit, offset: $offset) {
    id
    createdAt
    threadId
    decisionId
    meetingId
    circleId
    thread {
      id
      title
      status
      pinned
      private
      initiatorMember { name }
    }
    decision {
      id
      title
      description
      private
      member { name }
    }
    meeting {
      id
      title
      startDate
      endDate
      ended
      summary
      private
      meeting_attendees { member { name } }
    }
  }
  news_aggregate(where: $where) {
    aggregate { count }
  }
}`

        const data = await client.query(query, { where, limit, offset })
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
