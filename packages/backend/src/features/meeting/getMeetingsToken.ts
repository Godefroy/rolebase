import { TRPCError } from '@trpc/server'
import * as yup from 'yup'
import { gql } from '../../gql'
import { authedProcedure } from '../../trpc/authedProcedure'
import { adminRequest } from '../../utils/adminRequest'
import { generateMeetingToken } from './generateMeetingToken'

export default authedProcedure
  .input(
    yup.object().shape({
      orgId: yup.string().required(),
    })
  )
  .query(async (opts): Promise<string> => {
    const { orgId } = opts.input
    if (!opts.ctx.userId) {
      throw new TRPCError({ code: 'UNAUTHORIZED' })
    }

    // The token only unlocks the feed of the caller's own member
    const { member } = await adminRequest(GET_USER_MEMBER, {
      orgId,
      userId: opts.ctx.userId,
    })
    if (!member[0] || !member[0].role) {
      throw new TRPCError({ code: 'FORBIDDEN' })
    }

    return generateMeetingToken(orgId, member[0].id)
  })

const GET_USER_MEMBER = gql(`
  query getUserMemberForMeetingsToken($orgId: uuid!, $userId: uuid!) {
    member(
      where: {
        orgId: { _eq: $orgId }
        userId: { _eq: $userId }
        archivedAt: { _is_null: true }
        org: { archivedAt: { _is_null: true } }
      }
    ) {
      id
      role
    }
  }`)
