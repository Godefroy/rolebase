import { nhost } from './nhost'

export interface GraphqlPayload {
  query: string
  variables?: Record<string, unknown>
  operationName?: string
}

export interface GraphqlResult {
  data?: unknown
  errors?: Array<{ message: string; [key: string]: unknown }>
}

// Run a GraphQL request on Hasura with the permissions of a user.
// Used by the public GraphQL endpoint and the MCP server.
export async function userGraphqlRequest(
  userId: string,
  payload: GraphqlPayload
): Promise<GraphqlResult> {
  const { body } = await nhost.graphql.request(payload, {
    headers: {
      // The SDK spreads these options over its base fetch init, which
      // replaces the whole `headers` object and drops the default
      // Content-Type. Without it Hasura cannot parse the body and fails
      // with "key query not found", so re-add it here.
      'Content-Type': 'application/json',
      // Mandatory to scope to the user
      'X-Hasura-User-Id': userId,
      'X-Hasura-Role': 'user',
    },
  })
  return { data: body.data, errors: body.errors as GraphqlResult['errors'] }
}
