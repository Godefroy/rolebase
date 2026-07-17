import { z } from 'zod'
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import type { RolebaseClient } from '../client.js'
import { roleFields } from '../schema.js'
import type { ToolRegistrar } from './types.js'

export const registerRoleTools: ToolRegistrar = (server, client) => {
  server.tool(
    'get_roles',
    'List all roles in an organization',
    {
      orgId: z.string().uuid().describe('The organization ID'),
    },
    async ({ orgId }) => {
      try {
        const data = await client.query(
          `
          query GetRoles($orgId: uuid!) {
            role(where: { orgId: { _eq: $orgId }, archived: { _eq: false } }, order_by: { name: asc }) {
              ${roleFields}
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
    'get_role',
    'Get detailed information about a role including its circle(s)',
    {
      roleId: z.string().uuid().describe('The role ID'),
    },
    async ({ roleId }) => {
      try {
        const data = await client.query(
          `
          query GetRole($roleId: uuid!) {
            role_by_pk(id: $roleId) {
              ${roleFields}
              org { id name }
              circles(where: { archived: { _eq: false } }) {
                id
                parentId
                members {
                  id
                  memberId
                  member { name }
                }
              }
            }
          }
        `,
          { roleId }
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
    'create_role',
    'Create a new role in an organization. Governance rules apply: Owners can always create; in Free mode, Admins and Members can also create non-base roles.',
    {
      orgId: z.string().uuid().describe('The organization ID'),
      name: z.string().describe('Role name'),
      purpose: z.string().optional().describe('Role purpose'),
      domain: z.string().optional().describe('Role domain'),
      accountabilities: z
        .string()
        .optional()
        .describe('Role accountabilities'),
      checklist: z.string().optional().describe('Role checklist'),
      indicators: z.string().optional().describe('Role indicators'),
      notes: z.string().optional().describe('Role notes'),
      colorHue: z.number().optional().describe('Color hue for the role (0-360)'),
      singleMember: z
        .boolean()
        .optional()
        .describe('Whether this role has a single member'),
    },
    async ({ orgId, ...fields }) => {
      try {
        const data = await client.query(
          `
          mutation CreateRole($object: role_insert_input!) {
            insert_role_one(object: $object) {
              ${roleFields}
            }
          }
        `,
          { object: { orgId, ...fields } }
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
    'update_role',
    'Update a role. Governance rules apply based on the org governance mode.',
    {
      roleId: z.string().uuid().describe('The role ID'),
      name: z.string().optional().describe('New role name'),
      purpose: z.string().optional().describe('New purpose'),
      domain: z.string().optional().describe('New domain'),
      accountabilities: z
        .string()
        .optional()
        .describe('New accountabilities'),
      checklist: z.string().optional().describe('New checklist'),
      indicators: z.string().optional().describe('New indicators'),
      notes: z.string().optional().describe('New notes'),
      colorHue: z.number().optional().describe('New color hue (0-360)'),
      singleMember: z
        .boolean()
        .optional()
        .describe('Whether this role has a single member'),
    },
    async ({ roleId, ...fields }) => {
      try {
        const set: Record<string, unknown> = {}
        for (const [key, value] of Object.entries(fields)) {
          if (value !== undefined) set[key] = value
        }

        const data = await client.query(
          `
          mutation UpdateRole($roleId: uuid!, $set: role_set_input!) {
            update_role_by_pk(pk_columns: { id: $roleId }, _set: $set) {
              ${roleFields}
            }
          }
        `,
          { roleId, set }
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
