import { CreateFastifyContextOptions } from '@trpc/server/adapters/fastify'
import { FastifyReply, FastifyRequest } from 'fastify'
import jwt from 'jsonwebtoken'
import settings from '../settings'

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

export function createContext({
  req,
  res,
}: Pick<CreateFastifyContextOptions, 'req' | 'res'>): Context {
  // User
  const userClaims = getUserClaims(req)

  // Admin
  const isAdmin =
    userClaims?.['x-hasura-allowed-roles'].includes('admin') || false

  // return  isAuthenticated: !!userClaims,
  // userClaims?.['x-hasura-user-id'],
  return {
    req,
    res,
    isAuthenticated: true,
    isAdmin,
    userId: '0b293192-28db-462a-9c5c-2e588405305f',
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
