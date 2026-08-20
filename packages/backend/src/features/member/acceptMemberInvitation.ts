import {
  checkSubscriptionSeats,
  isSubscriptionActive,
} from '@rolebase/shared/model/subscription'
import { UserMetadata } from '@rolebase/shared/model/user'
import { TRPCError } from '@trpc/server'
import * as yup from 'yup'
import { gql } from '../../gql'
import { authedProcedure } from '../../trpc/authedProcedure'
import { adminRequest } from '../../utils/adminRequest'
import { getOrgSubscriptionAndActiveMembers } from '../orgSubscription/utils/getOrgSubscriptionAndActiveMembers'
import { updateStripeSubscription } from '../orgSubscription/utils/stripe'
import { updateUserMetadata } from '../user/utils/updateUserMetadata'
import { generateInviteToken } from './utils/generateInviteToken'
import { getMemberById } from './utils/getMemberById'
import { updateMember } from './utils/updateMember'

export default authedProcedure
  .input(
    yup.object().shape({
      memberId: yup.string().required(),
      token: yup.string().required(),
    })
  )
  .mutation(async (opts): Promise<void> => {
    const { memberId, token } = opts.input

    // Get member
    const member = await getMemberById(memberId)

    // Check if user is already a member of the org
    const checkUserResult = await adminRequest(CHECK_ORG_USER, {
      orgId: member.orgId,
      userId: opts.ctx.userId!,
    })
    if (checkUserResult.org_by_pk?.members[0]) {
      throw new TRPCError({
        code: 'CONFLICT',
        message: 'User is already a member of the org',
      })
    }

    const userEmail = checkUserResult.user?.email
    if (!userEmail) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'User not found',
      })
    }

    if (member.userId) {
      throw new TRPCError({
        code: 'CONFLICT',
        message: 'Member already attached to a user',
      })
    }

    if (!member.inviteDate) {
      throw new TRPCError({ code: 'NOT_FOUND', message: 'Member not invited' })
    }

    // Validate token
    const tokenTruth = generateInviteToken(
      memberId,
      new Date(member.inviteDate)
    )
    if (token !== tokenTruth) {
      throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Invalid token' })
    }

    // Verify that the org has not reached it's member limit
    const { subscription, activeMembers } =
      await getOrgSubscriptionAndActiveMembers(member.orgId)

    if (!checkSubscriptionSeats(subscription, activeMembers + 1)) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'Reached user limit',
      })
    }

    if (
      subscription &&
      subscription.stripeSubscriptionId &&
      isSubscriptionActive(subscription.status)
    ) {
      await updateStripeSubscription(
        subscription.stripeSubscriptionId,
        activeMembers + 1
      )
    }

    // Update member
    await updateMember(memberId, {
      userId: opts.ctx.userId,
      inviteEmail: userEmail,
    })

    // Joining an org through an invitation is how users with no org of their
    // own arrive: record it as their onboarding source, since they never go
    // through the onboarding wizard that asks for it.
    const metadata = (checkUserResult.user?.metadata ?? {}) as UserMetadata
    const isFirstOrg = checkUserResult.member.length === 0
    if (isFirstOrg && !metadata.onboardingSource) {
      await updateUserMetadata(opts.ctx.userId!, {
        ...metadata,
        onboardingSource: 'invitation',
      })
    }
  })

const CHECK_ORG_USER = gql(`
  query checkOrgUser($orgId: uuid!, $userId: uuid!) {
    org_by_pk(id: $orgId) {
      members(where: { userId: { _eq: $userId } }) {
        id
      }
    }
    user(id: $userId) {
      email
      metadata
    }
    member(where: { userId: { _eq: $userId } }, limit: 1) {
      id
    }
  }
`)
