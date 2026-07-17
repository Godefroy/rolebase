import { z } from 'zod'
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import type { RolebaseClient } from '../client.js'
import { orgFields } from '../schema.js'
import type { ToolRegistrar } from './types.js'

export const registerOrgTools: ToolRegistrar = (server, client) => {
  server.tool(
    'get_orgs',
    'List all organizations the authenticated user is a member of',
    {},
    async () => {
      try {
        const data = await client.query(`
          query GetOrgs {
            org(order_by: { name: asc }) {
              ${orgFields}
            }
          }
        `)
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
    'get_org',
    'Get detailed information about an organization including its roles, circles, and members',
    {
      orgId: z.string().uuid().describe('The organization ID'),
    },
    async ({ orgId }) => {
      try {
        const data = await client.query(
          `
          query GetOrg($orgId: uuid!) {
            org_by_pk(id: $orgId) {
              ${orgFields}
              roles(where: { archived: { _eq: false } }, order_by: { name: asc }) {
                id
                name
                purpose
                base
                parentLink
              }
              circles(where: { archived: { _eq: false } }) {
                id
                roleId
                parentId
                role { name }
                members {
                  id
                  memberId
                  member { name }
                }
              }
              members(where: { archived: { _eq: false } }, order_by: { name: asc }) {
                id
                name
                role
                description
                picture
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
    'update_org',
    'Update an organization. Only Owner or Admin members can update.',
    {
      orgId: z.string().uuid().describe('The organization ID'),
      name: z.string().optional().describe('New organization name'),
      shareOrg: z
        .boolean()
        .optional()
        .describe('Whether the org chart is shared publicly'),
      shareMembers: z
        .boolean()
        .optional()
        .describe('Whether the member list is shared publicly'),
      homeNote: z
        .string()
        .optional()
        .describe('Home page note/markdown content'),
    },
    async ({ orgId, ...fields }) => {
      try {
        const set: Record<string, unknown> = {}
        if (fields.name !== undefined) set.name = fields.name
        if (fields.shareOrg !== undefined) set.shareOrg = fields.shareOrg
        if (fields.shareMembers !== undefined)
          set.shareMembers = fields.shareMembers
        if (fields.homeNote !== undefined) set.homeNote = fields.homeNote

        const data = await client.query(
          `
          mutation UpdateOrg($orgId: uuid!, $set: org_set_input!) {
            update_org_by_pk(pk_columns: { id: $orgId }, _set: $set) {
              ${orgFields}
            }
          }
        `,
          { orgId, set }
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
