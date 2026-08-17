import { gql } from '../gql'
import { adminRequest } from './adminRequest'

// Resolve an API key to the user it belongs to.
// Used by the public GraphQL endpoint and by the tRPC context.
// Returns undefined if the key is unknown or archived.
export async function authenticateApiKey(
  apiKey: string
): Promise<string | undefined> {
  const apiKeys = await adminRequest(GET_USER_ID, { value: apiKey })
  const apiKeyRow = apiKeys.api_key[0]
  if (!apiKeyRow) return undefined

  // Record usage. Fire-and-forget so it never blocks or fails the request.
  adminRequest(UPDATE_LAST_USED, {
    id: apiKeyRow.id,
    lastUsedAt: new Date().toISOString(),
  }).catch((error) => {
    console.error('Failed to update api_key lastUsedAt', error)
  })

  return apiKeyRow.userId
}

const GET_USER_ID = gql(`
  query getApiKeyUserId($value: String!) {
    api_key(
      where: { value: { _eq: $value }, archivedAt: { _is_null: true } }
    ) {
      id
      userId
    }
  }
`)

const UPDATE_LAST_USED = gql(`
  mutation updateApiKeyLastUsed($id: uuid!, $lastUsedAt: timestamptz!) {
    update_api_key_by_pk(
      pk_columns: { id: $id }
      _set: { lastUsedAt: $lastUsedAt }
    ) {
      id
    }
  }
`)
