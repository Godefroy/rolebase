import sendMemberActivityEmail from '@rolebase/emails/helpers/sendMemberActivityEmail'
import {
  checkSubscriptionSeats,
  isSubscriptionActive,
} from '@rolebase/shared/model/subscription'
import { UserMetadata } from '@rolebase/shared/model/user'
import { TRPCError } from '@trpc/server'
import * as yup from 'yup'
import { gql, Member_Role_Enum } from '../../gql'
import { guardOrg } from '../../guards/guardOrg'
import settings from '../../settings'
import { authedProcedure } from '../../trpc/authedProcedure'
import { adminRequest } from '../../utils/adminRequest'
import { getOrgSubscriptionAndActiveMembers } from '../orgSubscription/utils/getOrgSubscriptionAndActiveMembers'
import { updateStripeSubscription } from '../orgSubscription/utils/stripe'
import { updateUserMetadata } from '../user/utils/updateUserMetadata'

// Accepts or refuses a request to join the org, for its admins. Accepting adds
// the requester as a member right away, with the Member access role. Either
// way, the requester is told by email.
export default authedProcedure
  .input(
    yup.object().shape({
      requestId: yup.string().uuid().required(),
      accept: yup.boolean().required(),
    })
  )
  .mutation(async (opts): Promise<void> => {
    const { requestId, accept } = opts.input

    const { org_access_request_by_pk: request } = await adminRequest(
      GET_ACCESS_REQUEST,
      { requestId }
    )
    if (!request || request.status !== 'Pending') {
      throw new TRPCError({ code: 'NOT_FOUND' })
    }
    const { orgId, userId } = request
    await guardOrg(orgId, Member_Role_Enum.Admin, opts.ctx)

    const { org_by_pk: org } = await adminRequest(GET_ORG_FOR_ACCESS_REQUEST, {
      orgId,
      userId,
      deciderUserId: opts.ctx.userId!,
    })
    if (!org) throw new TRPCError({ code: 'NOT_FOUND' })
    const decider = org.decider[0]
    const alreadyMember = org.requester.length > 0

    const seats =
      accept && !alreadyMember
        ? await getOrgSubscriptionAndActiveMembers(orgId)
        : undefined
    if (
      seats &&
      !checkSubscriptionSeats(seats.subscription, seats.activeMembers + 1)
    ) {
      throw new TRPCError({ code: 'FORBIDDEN', message: 'Reached user limit' })
    }

    // Decide only once, even when two admins answer at the same time
    const { update_org_access_request } = await adminRequest(
      DECIDE_ACCESS_REQUEST,
      {
        requestId,
        status: accept ? 'Accepted' : 'Refused',
        decidedByMemberId: decider?.id ?? null,
      }
    )
    if (update_org_access_request?.affected_rows !== 1) {
      throw new TRPCError({ code: 'CONFLICT', message: 'Already decided' })
    }

    const user = request.user
    if (seats) {
      const { subscription, activeMembers } = seats
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
      await adminRequest(INSERT_REQUESTER_MEMBER, {
        orgId,
        userId,
        name: user.displayName,
        email: user.email,
      })

      // Like an invitation, it is how this person arrives: record it as their
      // onboarding source when it is their first org
      const metadata = (user.metadata ?? {}) as UserMetadata
      if (user.members.length === 0 && !metadata.onboardingSource) {
        await updateUserMetadata(userId, {
          ...metadata,
          onboardingSource: 'accessRequest',
        })
      }
    }

    if (!user.email) return
    await sendMemberActivityEmail({
      recipients: [{ Email: user.email, Name: user.displayName }],
      type: accept ? 'OrgAccessAccepted' : 'OrgAccessRefused',
      lang: user.locale,
      replace: {
        member: decider?.name ?? '',
        org: org.name,
      },
      picture: decider?.picture || '',
      ctaUrl: accept ? `${settings.url}/orgs/${orgId}` : settings.url,
    })
  })

const GET_ACCESS_REQUEST = gql(`
  query getAccessRequest($requestId: uuid!) {
    org_access_request_by_pk(id: $requestId) {
      orgId
      userId
      status
      user {
        displayName
        email
        locale
        metadata
        members(limit: 1) {
          id
        }
      }
    }
  }
`)

const GET_ORG_FOR_ACCESS_REQUEST = gql(`
  query getOrgForAccessRequest(
    $orgId: uuid!
    $userId: uuid!
    $deciderUserId: uuid!
  ) {
    org_by_pk(id: $orgId) {
      name
      requester: members(
        where: { userId: { _eq: $userId }, archivedAt: { _is_null: true } }
      ) {
        id
      }
      decider: members(where: { userId: { _eq: $deciderUserId } }) {
        id
        name
        picture
      }
    }
  }
`)

const DECIDE_ACCESS_REQUEST = gql(`
  mutation decideAccessRequest(
    $requestId: uuid!
    $status: String!
    $decidedByMemberId: uuid
  ) {
    update_org_access_request(
      where: { id: { _eq: $requestId }, status: { _eq: "Pending" } }
      _set: {
        status: $status
        decidedAt: "now()"
        decidedByMemberId: $decidedByMemberId
      }
    ) {
      affected_rows
    }
  }
`)

const INSERT_REQUESTER_MEMBER = gql(`
  mutation insertRequesterMember(
    $orgId: uuid!
    $userId: uuid!
    $name: String!
    $email: String
  ) {
    insert_member_one(
      object: {
        orgId: $orgId
        userId: $userId
        name: $name
        inviteEmail: $email
        role: Member
      }
    ) {
      id
    }
  }
`)
