import { z } from 'zod'
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import type { RolebaseClient } from '../client.js'
import { memberFields } from '../schema.js'
import type { ToolRegistrar } from './types.js'

export const registerMemberTools: ToolRegistrar = (server, client) => {
  server.tool(
    'get_members',
    'List all members of an organization',
    {
      orgId: z.string().uuid().describe('The organization ID'),
    },
    async ({ orgId }) => {
      try {
        const data = await client.query(
          `
          query GetMembers($orgId: uuid!) {
            member(where: { orgId: { _eq: $orgId }, archived: { _eq: false } }, order_by: { name: asc }) {
              ${memberFields}
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
    'get_member',
    'Get detailed information about a member including their circle assignments',
    {
      memberId: z.string().uuid().describe('The member ID'),
    },
    async ({ memberId }) => {
      try {
        const data = await client.query(
          `
          query GetMember($memberId: uuid!) {
            member_by_pk(id: $memberId) {
              ${memberFields}
              org { id name }
              circle_members {
                id circleId
                circle {
                  id
                  role { name }
                }
              }
            }
          }
        `,
          { memberId }
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
    'update_member',
    'Update a member profile. Members can update their own profile; Admins/Owners can update any member.',
    {
      memberId: z.string().uuid().describe('The member ID'),
      name: z.string().optional().describe('New display name'),
      description: z.string().optional().describe('New bio/description'),
    },
    async ({ memberId, ...fields }) => {
      try {
        const set: Record<string, unknown> = {}
        if (fields.name !== undefined) set.name = fields.name
        if (fields.description !== undefined)
          set.description = fields.description

        const data = await client.query(
          `
          mutation UpdateMember($memberId: uuid!, $set: member_set_input!) {
            update_member_by_pk(pk_columns: { id: $memberId }, _set: $set) {
              ${memberFields}
            }
          }
        `,
          { memberId, set }
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
