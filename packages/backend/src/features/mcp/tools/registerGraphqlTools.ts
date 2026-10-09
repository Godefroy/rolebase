import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import {
  buildClientSchema,
  getIntrospectionQuery,
  GraphQLField,
  GraphQLObjectType,
  GraphQLSchema,
  IntrospectionQuery,
  printType,
} from 'graphql'
import { z } from 'zod'
import { userGraphqlRequest } from '../../../utils/userGraphqlRequest'
import { textResult } from '../utils/textResult'

export function registerGraphqlTools(server: McpServer, userId: string) {
  server.registerTool(
    'graphql',
    {
      title: 'Run a GraphQL query or mutation',
      description:
        'Run a GraphQL query or mutation on the Rolebase Hasura API, with the permissions of the API key user. Use graphql_schema to find tables, fields and input types. Before a mutation, describe the change to the user and wait for their approval.',
      inputSchema: {
        query: z.string().describe('GraphQL query or mutation'),
        variables: z
          .record(z.string(), z.unknown())
          .optional()
          .describe('Variables of the operation'),
      },
    },
    async ({ query, variables }) =>
      // GraphQL errors are thrown, and returned as tool errors by the SDK
      textResult(await userGraphqlRequest(userId, { query, variables }))
  )

  server.registerTool(
    'graphql_schema',
    {
      title: 'Explore the GraphQL schema',
      description:
        'Without argument, list the root query and mutation fields of the GraphQL API. With a type name (e.g. "task", "task_bool_exp", "task_insert_input"), print that type with its fields.',
      inputSchema: {
        type: z.string().optional().describe('Name of a type to print'),
      },
      annotations: { readOnlyHint: true },
    },
    async ({ type }) => {
      const schema = await getSchema(userId)

      if (!type) {
        return textResult(
          [schema.getQueryType(), schema.getMutationType()]
            .filter((root): root is GraphQLObjectType => !!root)
            .map(
              (root) =>
                `# ${root.name}\n` +
                Object.values(root.getFields()).map(printField).join('\n')
            )
            .join('\n\n')
        )
      }

      const namedType = schema.getType(type)
      if (!namedType) throw new Error(`Unknown type: ${type}`)
      return textResult(printType(namedType))
    }
  )
}

// One line per root field, with argument names only
function printField(field: GraphQLField<unknown, unknown>) {
  const args = field.args.length
    ? `(${field.args.map((arg) => arg.name).join(', ')})`
    : ''
  return `${field.name}${args}: ${field.type}`
}

// The schema only depends on the Hasura role, the same for every API key user.
// Cache it to avoid an introspection on every call.
const schemaTtl = 10 * 60 * 1000
let schemaCache: { promise: Promise<GraphQLSchema>; date: number } | undefined

function getSchema(userId: string): Promise<GraphQLSchema> {
  if (!schemaCache || Date.now() - schemaCache.date > schemaTtl) {
    const promise = userGraphqlRequest(userId, {
      query: getIntrospectionQuery(),
    }).then((result) => buildClientSchema(result.data as IntrospectionQuery))
    // Retry on next call if introspection fails
    promise.catch(() => (schemaCache = undefined))
    schemaCache = { promise, date: Date.now() }
  }
  return schemaCache.promise
}
