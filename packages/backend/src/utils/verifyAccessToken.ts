import jwt, { JwtPayload } from 'jsonwebtoken'
import settings from '../settings'

// Verify a Nhost access token and return its payload.
// Throws if the token is invalid or expired.
export function verifyAccessToken(accessToken: string): JwtPayload {
  if (!settings.jwtSecret) {
    throw new Error('NHOST_JWT_SECRET env var is not set')
  }
  const jwtSecret = JSON.parse(settings.jwtSecret)
  const payload = jwt.verify(accessToken, jwtSecret.key)
  if (typeof payload === 'string') {
    throw new Error('Invalid token payload')
  }
  return payload
}
