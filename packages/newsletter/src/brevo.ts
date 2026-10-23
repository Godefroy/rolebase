import { getEnv } from './env'

const apiUrl = 'https://api.brevo.com/v3'

export async function brevo<T = any>(
  method: string,
  path: string,
  body?: unknown
): Promise<T> {
  const response = await fetch(apiUrl + path, {
    method,
    headers: {
      'api-key': getEnv('BREVO_API_KEY'),
      'content-type': 'application/json',
      accept: 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  })
  const text = await response.text()
  if (!response.ok) {
    // Brevo only accepts the authorized IPs
    throw new Error(`Brevo ${method} ${path}: ${response.status} ${text}`)
  }
  return text ? JSON.parse(text) : (undefined as T)
}

// Fetches every page of a paginated list
export async function brevoAll<T>(
  path: string,
  key: string,
  limit: number
): Promise<T[]> {
  const items: T[] = []
  for (let offset = 0; ; offset += limit) {
    const separator = path.includes('?') ? '&' : '?'
    const page = await brevo(
      'GET',
      `${path}${separator}limit=${limit}&offset=${offset}`
    )
    const pageItems: T[] = page?.[key] || []
    items.push(...pageItems)
    if (pageItems.length < limit) return items
  }
}

// Waits for an asynchronous process (contacts import) to complete
export async function waitProcess(processId: number) {
  for (;;) {
    const process = await brevo('GET', `/processes/${processId}`)
    if (process.status === 'completed') return
    if (process.status !== 'queued' && process.status !== 'in_process') {
      throw new Error(`Brevo process ${processId}: ${process.status}`)
    }
    await new Promise((resolve) => setTimeout(resolve, 2000))
  }
}

// Addresses Brevo refuses to send to (hard bounces, spam reports...)
export async function getBlockedEmails(): Promise<Set<string>> {
  const contacts = await brevoAll<{ email: string }>(
    '/smtp/blockedContacts',
    'contacts',
    100
  )
  return new Set(contacts.map((c) => c.email.toLowerCase()))
}

export async function getCredits(): Promise<number> {
  const account = await brevo('GET', '/account')
  const plan = account.plan.find((p: any) => p.creditsType === 'sendLimit')
  return plan?.credits ?? 0
}
