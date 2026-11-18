import { verifyAccessToken } from '../../utils/verifyAccessToken'

export interface CollabTokenInfo {
  userId: string
  // Expiration date in ms
  expiresAt: number
}

// Verify a Nhost access token sent by the collaborative editor.
// Throws if the token is invalid, expired or has no user.
export function verifyCollabToken(token: string): CollabTokenInfo {
  const payload = verifyAccessToken(token)
  const userId = payload['https://hasura.io/jwt/claims']?.['x-hasura-user-id']
  if (typeof userId !== 'string' || !userId || !payload.exp) {
    throw new Error('Invalid token payload')
  }
  return { userId, expiresAt: payload.exp * 1000 }
}
