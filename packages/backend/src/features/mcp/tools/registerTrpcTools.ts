import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { AnyProcedure } from '@trpc/server'
import { isSchema } from 'yup'
import { z } from 'zod'
import { trpcRouter } from '../..'
import { createCallerFactory, Meta } from '../../../trpc'
import { Context } from '../../../trpc/context'
import { onTrpcError } from '../../../trpc/onTrpcError'
import { textResult } from '../utils/textResult'

export function registerTrpcTools(server: McpServer, ctx: Context) {
  server.registerTool(
    'trpc_procedures',
    {
      title: 'List the tRPC procedures',
      description:
        'List the tRPC procedures that can be called with the trpc tool, with their type and input shape ("?" marks optional fields).',
      annotations: { readOnlyHint: true },
    },
    async () =>
      textResult(
        Object.entries(getProcedures())
          .map(
            ([path, procedure]) =>
              `${path} (${procedure._def.type}): ${printInput(procedure)}`
          )
          .join('\n')
      )
  )

  server.registerTool(
    'trpc',
    {
      title: 'Call a tRPC procedure',
      description:
        'Call a tRPC procedure of the Rolebase backend, with the permissions of the API key user. List them with trpc_procedures. Before a mutation, describe the change to the user and wait for their approval.',
      inputSchema: {
        procedure: z
          .string()
          .describe('Procedure path, e.g. "member.inviteMember"'),
        input: z.unknown().optional().describe('Input of the procedure'),
      },
    },
    async ({ procedure, input }) => {
      if (!getProcedures()[procedure]) {
        throw new Error(
          `Unknown procedure: ${procedure}. List them with trpc_procedures.`
        )
      }
      // Resolve the procedure on a caller bound to the user's context
      const caller = createCallerFactory(trpcRouter)(ctx, {
        onError: onTrpcError,
      })
      const call = procedure
        .split('.')
        .reduce<any>((node, key) => node[key], caller)
      return textResult((await call(input)) ?? 'Done')
    }
  )
}

// Procedures callable from outside: no internal ones nor subscriptions.
// The router is read on call, as it imports this feature while being built.
function getProcedures(): Record<string, Procedure> {
  // Flat at runtime, keyed by path (e.g. "member.inviteMember")
  const procedures = trpcRouter._def.procedures as unknown as Record<
    string,
    Procedure
  >
  return Object.fromEntries(
    Object.entries(procedures).filter(
      ([, procedure]) =>
        !procedure._def.meta?.internal && procedure._def.type !== 'subscription'
    )
  )
}

type Procedure = AnyProcedure & { _def: { meta?: Meta } }

interface InputDescription {
  type: string
  optional?: boolean
  nullable?: boolean
  oneOf?: unknown[]
  fields?: Record<string, InputDescription>
  innerType?: InputDescription
}

// Inputs are validated with yup: print a compact shape from its description
function printInput(procedure: Procedure): string {
  const [input] = procedure._def.inputs
  if (!input) return 'no input'
  if (!isSchema(input)) return 'unknown'
  return printDescription(input.describe() as InputDescription)
}

function printDescription(description: InputDescription): string {
  let type = description.type
  if (description.oneOf?.length) {
    type = description.oneOf
      .filter((value) => value !== undefined)
      .map((value) => JSON.stringify(value))
      .join(' | ')
  } else if (description.fields) {
    type = `{ ${Object.entries(description.fields)
      .map(
        ([name, field]) =>
          `${name}${field.optional ? '?' : ''}: ${printDescription(field)}`
      )
      .join(', ')} }`
  } else if (description.innerType) {
    const { innerType } = description
    const itemType = printDescription(innerType)
    // Parenthesize unions
    type =
      innerType.oneOf?.length || innerType.nullable
        ? `(${itemType})[]`
        : `${itemType}[]`
  }
  return description.nullable ? `${type} | null` : type
}
