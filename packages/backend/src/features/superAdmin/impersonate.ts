import { TRPCError } from '@trpc/server'
import { createHash, randomUUID } from 'crypto'
import * as yup from 'yup'
import { gql } from '../../gql'
import { adminProcedure } from '../../trpc/adminProcedure'
import { adminRequest } from '../../utils/adminRequest'

// A Personal Access Token is a row of auth.refresh_tokens with type "pat" and
// the sha256 of the token. Hasura-auth only mints one for the caller's own
// account, so we insert it ourselves with the admin secret and let the webapp
// exchange it through /signin/pat. That exchange issues a separate regular
// refresh token, so the impersonated session outlives the PAT and the PAT can
// stay very short-lived.
const patExpiration = 60 * 1000 // 1 minute

export default adminProcedure
  .input(
    yup.object().shape({
      userId: yup.string().required(),
    })
  )
  .mutation(async (opts): Promise<{ personalAccessToken: string }> => {
    const { userId } = opts.input

    const { user } = await adminRequest(GET_USER, { id: userId })
    if (!user) {
      throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found' })
    }
    if (user.disabled) {
      throw new TRPCError({ code: 'FORBIDDEN', message: 'User is disabled' })
    }

    const personalAccessToken = randomUUID()
    const refreshTokenHash = `\\x${createHash('sha256')
      .update(personalAccessToken)
      .digest('hex')}`

    await adminRequest(CREATE_IMPERSONATION_PAT, {
      userId,
      refreshTokenHash,
      expiresAt: new Date(Date.now() + patExpiration).toISOString(),
      metadata: { name: 'impersonation', impersonatedBy: opts.ctx.userId },
    })

    console.log(
      `[Impersonation] ${opts.ctx.userId} impersonates ${userId} (${user.email})`
    )

    return { personalAccessToken }
  })

const GET_USER = gql(`
  query getUserForImpersonation($id: uuid!) {
    user(id: $id) {
      id
      email
      disabled
    }
  }
`)

const CREATE_IMPERSONATION_PAT = gql(`
  mutation createImpersonationPat(
    $userId: uuid!
    $refreshTokenHash: String!
    $expiresAt: timestamptz!
    $metadata: jsonb!
  ) {
    insertAuthRefreshToken(
      object: {
        userId: $userId
        type: pat
        refreshTokenHash: $refreshTokenHash
        expiresAt: $expiresAt
        metadata: $metadata
      }
    ) {
      id
    }
  }
`)
