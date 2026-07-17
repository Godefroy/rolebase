import { z } from 'zod'
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import type { RolebaseClient } from '../client.js'
import { circleFields } from '../schema.js'
import type { ToolRegistrar } from './types.js'

export const registerCircleTools: ToolRegistrar = (server, client) => {
  server.tool(
    'get_circles',
    'List all circles in an organization (the org chart structure)',
    {
      orgId: z.string().uuid().describe('The organization ID'),
    },
    async ({ orgId }) => {
      try {
        const data = await client.query(
          `
          query GetCircles($orgId: uuid!) {
            circle(where: { orgId: { _eq: $orgId }, archived: { _eq: false } }) {
              ${circleFields}
              role { id name }
              parent { id role { name } }
              members {
                id
                memberId
                member { id name }
              }
              children {
                id
                role { name }
              }
            }
          }
        `,
          { orgId }
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
    'get_circle',
    'Get detailed information about a circle including its role, members, leaders, children, threads, and meetings',
    {
      circleId: z.string().uuid().describe('The circle ID'),
    },
    async ({ circleId }) => {
      try {
        const data = await client.query(
          `
          query GetCircle($circleId: uuid!) {
            circle_by_pk(id: $circleId) {
              ${circleFields}
              role {
                id name purpose domain accountabilities
              }
              parent {
                id role { name }
              }
              members {
                id memberId
                member { id name picture role }
              }
              children(where: { archived: { _eq: false } }) {
                id
                role { id name }
              }
              threads(where: { archived: { _eq: false } }, order_by: { createdAt: desc }, limit: 20) {
                id title status createdAt pinned
              }
              meetings(where: { archived: { _eq: false } }, order_by: { startDate: desc }, limit: 10) {
                id title startDate endDate ended
              }
            }
          }
        `,
          { circleId }
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
    'create_circle',
    'Create a new circle in the org chart. You must provide either roleId (to create a circle for an existing role) or both roleId and parentId. Governance rules apply.',
    {
      orgId: z.string().uuid().describe('The organization ID'),
      roleId: z.string().uuid().describe('The role ID for this circle'),
      parentId: z
        .string()
        .uuid()
        .optional()
        .describe('Parent circle ID (null for root circle)'),
    },
    async ({ orgId, roleId, parentId }) => {
      try {
        const data = await client.query(
          `
          mutation CreateCircle($object: circle_insert_input!) {
            insert_circle_one(object: $object) {
              ${circleFields}
              role { name }
            }
          }
        `,
          {
            object: {
              orgId,
              roleId,
              parentId: parentId || null,
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
    'update_circle',
    'Update a circle (change parent or archive it). Governance rules apply.',
    {
      circleId: z.string().uuid().describe('The circle ID'),
      parentId: z
        .string()
        .uuid()
        .nullable()
        .optional()
        .describe('New parent circle ID (null to make root)'),
    },
    async ({ circleId, parentId }) => {
      try {
        const set: Record<string, unknown> = {}
        if (parentId !== undefined) set.parentId = parentId

        const data = await client.query(
          `
          mutation UpdateCircle($circleId: uuid!, $set: circle_set_input!) {
            update_circle_by_pk(pk_columns: { id: $circleId }, _set: $set) {
              ${circleFields}
              role { name }
            }
          }
        `,
          { circleId, set }
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
