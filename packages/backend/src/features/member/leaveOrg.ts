import { TRPCError } from '@trpc/server'
import * as yup from 'yup'
import { gql } from '../../gql'
import { authedProcedure } from '../../trpc/authedProcedure'
import { adminRequest } from '../../utils/adminRequest'
import { archiveMemberWithSeats } from './utils/archiveMemberWithSeats'

// The current user leaves an org: their member is archived. The last owner
// can't leave.
export default authedProcedure
  .input(
    yup.object().shape({
      orgId: yup.string().uuid().required(),
    })
  )
  .mutation(async (opts): Promise<void> => {
    const { orgId } = opts.input
    const { member } = await adminRequest(GET_OWN_MEMBER, {
      orgId,
      userId: opts.ctx.userId!,
    })
    if (!member[0]) {
      throw new TRPCError({ code: 'NOT_FOUND', message: 'Member not found' })
    }

    await archiveMemberWithSeats(opts.ctx, member[0])
  })

const GET_OWN_MEMBER = gql(`
  query getOwnMemberToLeaveOrg($orgId: uuid!, $userId: uuid!) {
    member(
      where: {
        orgId: { _eq: $orgId }
        userId: { _eq: $userId }
        archivedAt: { _is_null: true }
      }
    ) {
      id
      orgId
      userId
      role
    }
  }
`)
