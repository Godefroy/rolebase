import { z } from 'zod'
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import type { RolebaseClient } from '../client.js'
import { threadFields, threadActivityFields } from '../schema.js'
import type { ToolRegistrar } from './types.js'

export const registerThreadTools: ToolRegistrar = (server, client) => {
  server.tool(
    'get_threads',
    'List threads in a circle, ordered by most recent',
    {
      circleId: z.string().uuid().describe('The circle ID'),
      limit: z
        .number()
        .int()
        .min(1)
        .max(100)
        .optional()
        .default(20)
        .describe('Max threads to return'),
    },
    async ({ circleId, limit }) => {
      try {
        const data = await client.query(
          `
          query GetThreads($circleId: uuid!, $limit: Int!) {
            thread(
              where: { circleId: { _eq: $circleId }, archived: { _eq: false } }
              order_by: { createdAt: desc }
              limit: $limit
            ) {
              ${threadFields}
              initiatorMember { name }
              activities(order_by: { createdAt: desc }, limit: 1) {
                ${threadActivityFields}
              }
            }
          }
        `,
          { circleId, limit }
        )
        return {
          content: [
            { type: 'text' as const, text: JSON.stringify(data, null, 2) },
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

  server.tool(
    'get_thread',
    'Get a thread with all its activities (messages, proposals, etc.)',
    {
      threadId: z.string().uuid().describe('The thread ID'),
    },
    async ({ threadId }) => {
      try {
        const data = await client.query(
          `
          query GetThread($threadId: uuid!) {
            thread_by_pk(id: $threadId) {
              ${threadFields}
              circle { id role { name } }
              initiatorMember { id name }
              activities(order_by: { createdAt: asc }) {
                ${threadActivityFields}
                reactions {
                  id shortcode userId
                }
              }
              extra_members {
                id memberId
                member { name }
              }
            }
          }
        `,
          { threadId }
        )
        return {
          content: [
            { type: 'text' as const, text: JSON.stringify(data, null, 2) },
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

  server.tool(
    'create_thread',
    'Create a new discussion thread in a circle',
    {
      orgId: z.string().uuid().describe('The organization ID'),
      circleId: z.string().uuid().describe('The circle ID'),
      initiatorMemberId: z
        .string()
        .uuid()
        .describe('The member ID of the thread creator'),
      title: z.string().describe('Thread title'),
      private: z
        .boolean()
        .optional()
        .default(false)
        .describe('Whether the thread is private'),
    },
    async ({ orgId, circleId, initiatorMemberId, title, private: isPrivate }) => {
      try {
        const data = await client.query(
          `
          mutation CreateThread($object: thread_insert_input!) {
            insert_thread_one(object: $object) {
              ${threadFields}
            }
          }
        `,
          {
            object: {
              orgId,
              circleId,
              initiatorMemberId,
              title,
              private: isPrivate,
              status: 'Active',
            },
          }
        )
        return {
          content: [
            { type: 'text' as const, text: JSON.stringify(data, null, 2) },
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

  server.tool(
    'add_thread_activity',
    'Add a message activity to a thread. The activity type is automatically set to Message. Note: userId is always set to the authenticated user (API key owner).',
    {
      threadId: z.string().uuid().describe('The thread ID'),
      message: z.string().describe('Message content in markdown format'),
    },
    async ({ threadId, message }) => {
      try {
        const data = await client.query(
          `
          mutation AddActivity($object: thread_activity_insert_input!) {
            insert_thread_activity_one(object: $object) {
              ${threadActivityFields}
            }
          }
        `,
          {
            object: {
              threadId,
              type: 'Message',
              data: { message },
            },
          }
        )
        return {
          content: [
            { type: 'text' as const, text: JSON.stringify(data, null, 2) },
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
