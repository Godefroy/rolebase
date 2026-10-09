import * as yup from 'yup'
import { registerRestRoutes } from '../../rest/registerRestRoutes'
import { authenticateApiKey } from '../../utils/authenticateApiKey'
import { userGraphqlRequest } from '../../utils/userGraphqlRequest'

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

      const userId = await authenticateApiKey(apiKey)
      if (!userId) {
        res.status(403).send({ errors: [{ message: 'Invalid API key' }] })
        return
      }

      try {
        const { query, variables, operationName } =
          await payloadSchema.validate(req.body)
        const result = await userGraphqlRequest(userId, {
          query,
          variables,
          operationName,
        })
        // Forward both data and errors so query errors surface to the client.
        res.send(result)
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error)
        res.status(400).send({ errors: [{ message }] })
      }
    })
  })
})
