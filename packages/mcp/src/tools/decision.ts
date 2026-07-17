import { z } from 'zod'
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import type { RolebaseClient } from '../client.js'
import { decisionFields } from '../schema.js'
import type { ToolRegistrar } from './types.js'

export const registerDecisionTools: ToolRegistrar = (server, client) => {
  server.tool(
    'get_decisions',
    'List decisions in a circle',
    {
      circleId: z.string().uuid().describe('The circle ID'),
      limit: z
        .number()
        .int()
        .min(1)
        .max(100)
        .optional()
        .default(20)
        .describe('Max decisions to return'),
    },
    async ({ circleId, limit }) => {
      try {
        const data = await client.query(
          `
          query GetDecisions($circleId: uuid!, $limit: Int!) {
            decision(
              where: { circleId: { _eq: $circleId }, archived: { _eq: false } }
              order_by: { createdAt: desc }
              limit: $limit
            ) {
              ${decisionFields}
              member { name }
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
    'create_decision',
    'Record a decision in a circle',
    {
      orgId: z.string().uuid().describe('The organization ID'),
      circleId: z.string().uuid().describe('The circle ID'),
      memberId: z
        .string()
        .uuid()
        .describe('The member ID of the decision author'),
      title: z.string().describe('Decision title'),
      description: z
        .string()
        .optional()
        .describe('Decision description/details'),
      private: z
        .boolean()
        .optional()
        .default(false)
        .describe('Whether the decision is private'),
    },
    async ({
      orgId,
      circleId,
      memberId,
      title,
      description,
      private: isPrivate,
    }) => {
      try {
        const object: Record<string, unknown> = {
          orgId,
          circleId,
          memberId,
          title,
          private: isPrivate,
        }
        if (description) object.description = description

        const data = await client.query(
          `
          mutation CreateDecision($object: decision_insert_input!) {
            insert_decision_one(object: $object) {
              ${decisionFields}
            }
          }
        `,
          { object }
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
