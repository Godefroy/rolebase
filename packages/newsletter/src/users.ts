import { defaultLang, Lang, langs } from './config'
import { getEnv } from './env'

export interface Recipient {
  id: string
  email: string
  displayName: string
  locale: string
  createdAt: string
}

async function hasura<T>(query: string, variables?: object): Promise<T> {
  const response = await fetch(getEnv('HASURA_PROD_GRAPHQL_URL'), {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-hasura-admin-secret': getEnv('HASURA_PROD_ADMIN_SECRET'),
    },
    body: JSON.stringify({ query, variables }),
  })
  const json = await response.json()
  if (!response.ok || json.errors) {
    throw new Error(`Hasura: ${JSON.stringify(json.errors || json)}`)
  }
  return json.data
}

const fields = 'id email displayName locale createdAt'

// Users not disabled, with an email
export async function getRecipients(): Promise<Recipient[]> {
  const { users } = await hasura<{ users: Recipient[] }>(
    `query { users(where: { disabled: { _eq: false }, email: { _is_null: false } }) { ${fields} } }`
  )
  return users
}

export async function getTestRecipient(): Promise<Recipient> {
  const id = getEnv('NEWSLETTER_TEST_USER_ID')
  const { user } = await hasura<{ user: Recipient | null }>(
    `query ($id: uuid!) { user(id: $id) { ${fields} } }`,
    { id }
  )
  if (!user?.email) throw new Error(`Test user ${id} not found`)
  return user
}

export function getRecipientLang(user: Recipient): Lang {
  return (langs as readonly string[]).includes(user.locale)
    ? (user.locale as Lang)
    : defaultLang
}

export function getFirstName(user: Recipient) {
  // Skip display names that are an email address
  if (!user.displayName || user.displayName.includes('@')) return undefined
  return user.displayName.trim().split(/\s+/)[0]
}
