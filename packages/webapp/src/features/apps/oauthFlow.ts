import { App_Type_Enum } from '@gql'
import { UserLocalStorageKeys } from '@utils/localStorage'

// OAuth state and PKCE verifier of a calendar connection started in this
// browser. The callback is accepted only if its state matches, so a callback
// URL crafted by someone else can't connect their calendar to this account.
// Stored in localStorage because the provider page opens in a new tab.

interface OAuthFlow {
  state: string
  codeVerifier: string
  createdAt: number
}

const FLOW_TTL_MS = 15 * 60 * 1000

function getKey(type: App_Type_Enum) {
  return UserLocalStorageKeys.OAuthFlow.replace('{id}', type)
}

function randomString(bytes: number): string {
  const array = crypto.getRandomValues(new Uint8Array(bytes))
  return base64UrlEncode(array)
}

function base64UrlEncode(array: Uint8Array): string {
  let binary = ''
  array.forEach((byte) => (binary += String.fromCharCode(byte)))
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

// Create and store a new flow, synchronously
export function createOAuthFlow(type: App_Type_Enum): OAuthFlow {
  const flow: OAuthFlow = {
    state: randomString(32),
    codeVerifier: randomString(48),
    createdAt: Date.now(),
  }
  localStorage.setItem(getKey(type), JSON.stringify(flow))
  return flow
}

// PKCE S256 code challenge
export async function getCodeChallenge(codeVerifier: string): Promise<string> {
  const digest = await crypto.subtle.digest(
    'SHA-256',
    new TextEncoder().encode(codeVerifier)
  )
  return base64UrlEncode(new Uint8Array(digest))
}

// Return the code verifier if state matches the flow started in this browser.
// The flow is removed in any case, so it can be used only once.
export function consumeOAuthFlow(
  type: App_Type_Enum,
  state: string | null
): string | undefined {
  const key = getKey(type)
  const value = localStorage.getItem(key)
  localStorage.removeItem(key)
  if (!value || !state) return

  try {
    const flow: OAuthFlow = JSON.parse(value)
    if (
      typeof flow.state !== 'string' ||
      typeof flow.codeVerifier !== 'string' ||
      flow.state !== state ||
      Date.now() - flow.createdAt > FLOW_TTL_MS
    ) {
      return
    }
    return flow.codeVerifier
  } catch {
    return
  }
}
