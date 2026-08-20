import { gql } from '../../gql'
import { authedProcedure } from '../../trpc/authedProcedure'
import { adminRequest } from '../../utils/adminRequest'
import { generateInviteToken } from './utils/generateInviteToken'

export interface PendingInvitation {
  memberId: string
  token: string
  orgId: string
  orgName: string
}

// Invitations waiting for the current user, matched on their email address.
// Used to offer joining an org instead of creating one when a user with no org
// signs in outside of the invitation link.
export default authedProcedure.query(
  async (opts): Promise<PendingInvitation[]> => {
    const userId = opts.ctx.userId!

    const userResult = await adminRequest(GET_USER_EMAIL, { userId })
    const user = userResult.user
    // Sign up doesn't require email verification, so an unverified address may
    // belong to someone else: only an owned address gives access to its invites
    if (!user?.email || !user.emailVerified) return []

    const emails = [user.email, user.email.toLowerCase()]
    const result = await adminRequest(GET_PENDING_INVITATIONS, {
      emails,
      userId,
    })

    return result.member.flatMap((member) =>
      member.inviteDate
        ? {
            memberId: member.id,
            token: generateInviteToken(member.id, new Date(member.inviteDate)),
            orgId: member.orgId,
            orgName: member.org.name,
          }
        : []
    )
  }
)

const GET_USER_EMAIL = gql(`
  query getUserVerifiedEmail($userId: uuid!) {
    user(id: $userId) {
      email
      emailVerified
    }
  }
`)

const GET_PENDING_INVITATIONS = gql(`
  query getUserPendingInvitations($emails: [String!]!, $userId: uuid!) {
    member(
      where: {
        userId: { _is_null: true }
        inviteEmail: { _in: $emails }
        inviteDate: { _is_null: false }
        archivedAt: { _is_null: true }
        org: {
          archivedAt: { _is_null: true }
          _not: { members: { userId: { _eq: $userId } } }
        }
      }
    ) {
      id
      orgId
      inviteDate
      org {
        name
      }
    }
  }
`)
