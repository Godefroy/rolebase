import * as yup from 'yup'
import { gql } from '../../gql'
import { registerRestRoutes } from '../../rest/registerRestRoutes'
import { adminRequest } from '../../utils/adminRequest'
import { nhost } from '../../utils/nhost'

// Public GraphQL API
// Keys are stored in api_key table
// Request is scoped to the user

const payloadSchema = yup.object({
  query: yup.string().required(),
  variables: yup.object().optional(),
  operationName: yup.string().optional(),
})

registerRestRoutes(async (app) => {
  app.register(async (app) => {
    app.post('/graphql', async (req, res) => {
      const apiKey = req.headers['x-api-key'] as string
      if (!apiKey) {
        // GraphQL-shaped JSON error so any client (including the playground)
        // renders it instead of failing to parse a plain-text body.
        res.status(403).send({ errors: [{ message: 'Missing API key' }] })
        return
      }

      const apiKeys = await adminRequest(GET_USER_ID, {
        value: apiKey,
      })
      const apiKeyRow = apiKeys.api_key[0]
      const userId = apiKeyRow?.userId
      if (!userId) {
        res.status(403).send({ errors: [{ message: 'Invalid API key' }] })
        return
      }

      // Record usage. Fire-and-forget so it never blocks or fails the request.
      adminRequest(UPDATE_LAST_USED, {
        id: apiKeyRow.id,
        lastUsedAt: new Date().toISOString(),
      }).catch((error) => {
        console.error('Failed to update api_key lastUsedAt', error)
      })

      try {
        const { query, variables, operationName } =
          await payloadSchema.validate(req.body)
        const { body } = await nhost.graphql.request(
          { query, variables, operationName },
          {
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
        )
        // Forward both data and errors so query errors surface to the client.
        res.send({ data: body.data, errors: body.errors })
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error)
        res.status(400).send({ errors: [{ message }] })
      }
    })
  })
})

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
