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
      const userId = apiKeys.api_key[0]?.userId
      if (!userId) {
        res.status(403).send({ errors: [{ message: 'Invalid API key' }] })
        return
      }

      try {
        const { query, variables } = await payloadSchema.validate(req.body)
        const { body } = await nhost.graphql.request(
          { query, variables },
          {
            headers: {
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
      userId
    }
  }
`)
