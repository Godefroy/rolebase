import { z } from 'zod'
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import type { RolebaseClient } from '../client.js'
import { meetingFields } from '../schema.js'
import type { ToolRegistrar } from './types.js'

export const registerMeetingTools: ToolRegistrar = (server, client) => {
  server.tool(
    'get_meetings',
    'List meetings in a circle, ordered by most recent start date',
    {
      circleId: z.string().uuid().describe('The circle ID'),
      limit: z
        .number()
        .int()
        .min(1)
        .max(100)
        .optional()
        .default(20)
        .describe('Max meetings to return'),
    },
    async ({ circleId, limit }) => {
      try {
        const data = await client.query(
          `
          query GetMeetings($circleId: uuid!, $limit: Int!) {
            meeting(
              where: { circleId: { _eq: $circleId }, archived: { _eq: false } }
              order_by: { startDate: desc }
              limit: $limit
            ) {
              ${meetingFields}
              circle { role { name } }
              meeting_attendees {
                id memberId
                member { name }
                present
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
    'get_meeting',
    'Get detailed information about a meeting including steps, attendees, and notes',
    {
      meetingId: z.string().uuid().describe('The meeting ID'),
    },
    async ({ meetingId }) => {
      try {
        const data = await client.query(
          `
          query GetMeeting($meetingId: uuid!) {
            meeting_by_pk(id: $meetingId) {
              ${meetingFields}
              circle {
                id role { name }
              }
              steps(order_by: { stepConfigId: asc }) {
                id stepConfigId type data notes
              }
              meeting_attendees {
                id memberId
                member { id name picture }
                present
              }
            }
          }
        `,
          { meetingId }
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
    'create_meeting',
    'Create a new meeting in a circle',
    {
      orgId: z.string().uuid().describe('The organization ID'),
      circleId: z.string().uuid().describe('The circle ID'),
      title: z.string().describe('Meeting title'),
      startDate: z.string().describe('Meeting start date (ISO 8601)'),
      endDate: z.string().describe('Meeting end date (ISO 8601)'),
      stepsConfig: z
        .array(
          z.object({
            id: z.string(),
            type: z.enum(['Tour', 'Threads', 'Checklist', 'Indicators', 'Tasks']),
            title: z.string(),
          })
        )
        .optional()
        .default([{ id: 'step-1', type: 'Tour', title: 'Tour de table' }])
        .describe('Meeting steps configuration'),
      videoConf: z
        .string()
        .optional()
        .describe('Video conference URL'),
      private: z
        .boolean()
        .optional()
        .default(false)
        .describe('Whether the meeting is private'),
    },
    async ({
      orgId,
      circleId,
      title,
      startDate,
      endDate,
      stepsConfig,
      videoConf,
      private: isPrivate,
    }) => {
      try {
        const data = await client.query(
          `
          mutation CreateMeeting($object: meeting_insert_input!) {
            insert_meeting_one(object: $object) {
              ${meetingFields}
            }
          }
        `,
          {
            object: {
              orgId,
              circleId,
              title,
              startDate,
              endDate,
              stepsConfig,
              videoConf: videoConf || null,
              private: isPrivate,
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
