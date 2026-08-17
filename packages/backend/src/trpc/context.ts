import { CreateFastifyContextOptions } from '@trpc/server/adapters/fastify'
import { FastifyReply, FastifyRequest } from 'fastify'
import jwt from 'jsonwebtoken'
import settings from '../settings'
import { authenticateApiKey } from '../utils/authenticateApiKey'

export type Context = {
  req: FastifyRequest
  res: FastifyReply
  isAuthenticated: boolean
  isAdmin: boolean
  userId?: string
  userClaims?: UserHasuraClaims
}

export type UserHasuraClaims = {
  'x-hasura-user-id': string
  'x-hasura-default-role': string
  'x-hasura-allowed-roles': string[]
} & {
  [key: string]: string // had to add this here to avoide adding `| string[]` at the end here.
}

export async function createContext({
  req,
  res,
}: Pick<CreateFastifyContextOptions, 'req' | 'res'>): Promise<Context> {
  // User
  const userClaims = getUserClaims(req)

  // Admin
  const isAdmin =
    userClaims?.['x-hasura-allowed-roles'].includes('admin') || false

  // API key, used by external integrations instead of an access token.
  // The access token wins when both are provided, since it's what the app sends.
  // An API key never grants admin: it's scoped to its user only.
  const apiKeyUserId = userClaims ? undefined : await getApiKeyUserId(req)

  // return
  return {
    req,
    res,
    isAuthenticated: !!userClaims || !!apiKeyUserId,
    isAdmin,
    userId: userClaims?.['x-hasura-user-id'] ?? apiKeyUserId,
    userClaims,
  }
}

export const getUserClaims = (
  req: FastifyRequest
): UserHasuraClaims | undefined => {
  try {
    const authorizationHeader = req.headers['authorization']
    const accessToken = authorizationHeader?.split(' ')[1]

    if (!accessToken) {
      return undefined
    }

    if (!settings.jwtSecret) {
      throw new Error('NHOST_JWT_SECRET env var is not set')
    }

    const jwtSecret = JSON.parse(settings.jwtSecret)
    const decodedToken = jwt.verify(accessToken, jwtSecret.key) as any
    return decodedToken['https://hasura.io/jwt/claims'] as UserHasuraClaims
  } catch (error) {
    return undefined
  }
}

// Never throws: a failed lookup yields an anonymous context, so guards answer
// with 401 instead of the whole request failing with a 500.
const getApiKeyUserId = async (
  req: FastifyRequest
): Promise<string | undefined> => {
  const apiKey = req.headers['x-api-key']
  if (typeof apiKey !== 'string' || !apiKey) {
    return undefined
  }
  try {
    return await authenticateApiKey(apiKey)
  } catch (error) {
    return undefined
  }
}
