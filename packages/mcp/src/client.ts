export interface GraphQLResponse<T = unknown> {
  data?: T
  errors?: Array<{
    message: string
    extensions?: Record<string, unknown>
  }>
}

export interface GraphQLRequest {
  query: string
  variables?: Record<string, unknown>
}

export class RolebaseClient {
  private apiUrl: string
  private headers: Record<string, string>

  constructor() {
    this.apiUrl = process.env.ROLEBASE_API_URL
    if (!this.apiUrl) {
      throw new Error(
        'ROLEBASE_API_URL environment variable is required (e.g. https://{sub}.graphql.{region}.nhost.run/v1/graphql)'
      )
    }

    this.headers = {
      'Content-Type': 'application/json',
    }

    const apiKey = process.env.ROLEBASE_API_KEY
    const jwtToken = process.env.ROLEBASE_JWT_TOKEN

    if (apiKey) {
      this.headers['x-api-key'] = apiKey
    } else if (jwtToken) {
      this.headers['Authorization'] = `Bearer ${jwtToken}`
    } else {
      throw new Error(
        'Either ROLEBASE_API_KEY or ROLEBASE_JWT_TOKEN environment variable is required'
      )
    }
  }

  async query<T = unknown>(
    query: string,
    variables?: Record<string, unknown>
  ): Promise<T> {
    const response = await fetch(this.apiUrl, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify({ query, variables }),
    })

    if (!response.ok) {
      const text = await response.text()
      throw new Error(`GraphQL HTTP error ${response.status}: ${text}`)
    }

    const result = (await response.json()) as GraphQLResponse<T>

    if (result.errors && result.errors.length > 0) {
      const messages = result.errors.map((e) => e.message).join('\n')
      throw new Error(`GraphQL errors:\n${messages}`)
    }

    return result.data as T
  }
}
