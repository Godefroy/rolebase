import { TypedDocumentNode } from '@graphql-typed-document-node/core'
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
  const { body } = await nhost.graphql.request(payload, getUserOptions(userId))
  return { data: body.data, errors: body.errors as GraphqlResult['errors'] }
}

// Typed variant of userGraphqlRequest, for documents built with `gql`.
// Throws on GraphQL errors, like adminRequest.
export async function userRequest<Result, Variables>(
  userId: string,
  document: TypedDocumentNode<Result, Variables>,
  variables: Variables
): Promise<Result> {
  const { body } = await nhost.graphql.request(
    document,
    variables,
    getUserOptions(userId)
  )
  if (!body.data) {
    throw new Error('No data returned')
  }
  return body.data as Result
}

function getUserOptions(userId: string): RequestInit {
  return {
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
  }
}
