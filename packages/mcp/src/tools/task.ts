import { z } from 'zod'
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import type { RolebaseClient } from '../client.js'
import { taskFields } from '../schema.js'
import type { ToolRegistrar } from './types.js'

export const registerTaskTools: ToolRegistrar = (server, client) => {
  server.tool(
    'get_tasks',
    'List tasks in a circle',
    {
      circleId: z.string().uuid().describe('The circle ID'),
      limit: z
        .number()
        .int()
        .min(1)
        .max(100)
        .optional()
        .default(20)
        .describe('Max tasks to return'),
    },
    async ({ circleId, limit }) => {
      try {
        const data = await client.query(
          `
          query GetTasks($circleId: uuid!, $limit: Int!) {
            task(
              where: { circleId: { _eq: $circleId }, archived: { _eq: false } }
              order_by: { createdAt: desc }
              limit: $limit
            ) {
              ${taskFields}
              member { id name }
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
    'create_task',
    'Create a new task in a circle',
    {
      orgId: z.string().uuid().describe('The organization ID'),
      circleId: z.string().uuid().describe('The circle ID'),
      memberId: z
        .string()
        .uuid()
        .describe('The member ID of the assigned person'),
      title: z.string().describe('Task title'),
      description: z.string().optional().describe('Task description'),
      status: z
        .enum(['Open', 'InProgress', 'InReview', 'Blocked', 'Done'])
        .optional()
        .default('Open')
        .describe('Task status'),
      dueDate: z
        .string()
        .optional()
        .describe('Due date (ISO 8601)'),
      private: z
        .boolean()
        .optional()
        .default(false)
        .describe('Whether the task is private'),
    },
    async ({
      orgId,
      circleId,
      memberId,
      title,
      description,
      status,
      dueDate,
      private: isPrivate,
    }) => {
      try {
        const object: Record<string, unknown> = {
          orgId,
          circleId,
          memberId,
          title,
          status,
          private: isPrivate,
        }
        if (description) object.description = description
        if (dueDate) object.dueDate = dueDate

        const data = await client.query(
          `
          mutation CreateTask($object: task_insert_input!) {
            insert_task_one(object: $object) {
              ${taskFields}
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

  server.tool(
    'update_task',
    'Update a task (status, assignee, due date, etc.)',
    {
      taskId: z.string().uuid().describe('The task ID'),
      title: z.string().optional().describe('New title'),
      description: z.string().optional().describe('New description'),
      dueDate: z
        .string()
        .nullable()
        .optional()
        .describe('New due date (ISO 8601, null to clear)'),
      memberId: z
        .string()
        .uuid()
        .optional()
        .describe('New assigned member ID'),
      status: z
        .string()
        .optional()
        .describe('New status value'),
    },
    async ({ taskId, ...fields }) => {
      try {
        const set: Record<string, unknown> = {}
        if (fields.title !== undefined) set.title = fields.title
        if (fields.description !== undefined)
          set.description = fields.description
        if (fields.dueDate !== undefined) set.dueDate = fields.dueDate
        if (fields.memberId !== undefined) set.memberId = fields.memberId
        if (fields.status !== undefined) set.status = fields.status

        const data = await client.query(
          `
          mutation UpdateTask($taskId: uuid!, $set: task_set_input!) {
            update_task_by_pk(pk_columns: { id: $taskId }, _set: $set) {
              ${taskFields}
            }
          }
        `,
          { taskId, set }
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
