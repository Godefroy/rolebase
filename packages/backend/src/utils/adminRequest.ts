import { TypedDocumentNode } from '@graphql-typed-document-node/core'
import { nhost } from './nhost'

const maxAttempts = 3
const retryDelay = 2000

export async function adminRequest<Result, Variables>(
  document: TypedDocumentNode<Result, Variables>,
  variables?: Variables
): Promise<Result> {
  const attempts = isQuery(document) ? maxAttempts : 1

  for (let attempt = 1; ; attempt++) {
    try {
      const result = await nhost.graphql.request(document, variables)
      if (!result.body.data) {
        throw new Error('No data returned')
      }
      return result.body.data as Result
    } catch (error) {
      if (attempt >= attempts || !isTransientError(error)) throw error
      await new Promise((resolve) => setTimeout(resolve, retryDelay * attempt))
    }
  }
}

// Only queries are retried: a mutation that times out may well have been
// applied, so replaying it could duplicate the write.
function isQuery(document: TypedDocumentNode<any, any>): boolean {
  return document.definitions.every(
    (definition) =>
      definition.kind !== 'OperationDefinition' ||
      definition.operation === 'query'
  )
}

// Hasura is briefly unreachable during restarts and backup windows. The request
// then fails with a network error, or the gateway answers with an HTML error
// page that the GraphQL client tries to parse as JSON.
function isTransientError(error: unknown): boolean {
  const messages: string[] = []
  for (let current: any = error; current; current = current.cause) {
    if (typeof current.message === 'string') messages.push(current.message)
    if (typeof current.code === 'string') messages.push(current.code)
  }

  return messages.some((message) =>
    /fetch failed|is not valid JSON|Headers Timeout|Body Timeout|socket hang up|ECONNRESET|ECONNREFUSED|ETIMEDOUT|EAI_AGAIN|502|503|504/i.test(
      message
    )
  )
}
