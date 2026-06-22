import sendMemberActivityEmail from '@rolebase/emails/helpers/sendMemberActivityEmail'
import { gql } from '../../gql'
import settings from '../../settings'
import { webhookProcedure } from '../../trpc/webhookProcedure'
import { adminRequest } from '../../utils/adminRequest'
import { generateInviteToken } from '../member/utils/generateInviteToken'

// Reminder thresholds in days after inviteDate
const REMINDER_DAYS = [1, 3, 7, 14, 30]

export default webhookProcedure.mutation(async () => {
  const { member: members } = await adminRequest(GET_PENDING_INVITATIONS)

  const now = Date.now()

  for (const member of members) {
    const inviteDate = new Date(member.inviteDate!)
    const daysSinceInvite = (now - inviteDate.getTime()) / (1000 * 60 * 60 * 24)

    // Check if we're in a reminder window (within 1 day after a threshold)
    const shouldSend = REMINDER_DAYS.some(
      (day) => daysSinceInvite >= day && daysSinceInvite < day + 1
    )
    if (!shouldSend) continue

    const org = member.org
    const adminMember = org.members[0]
    if (!adminMember?.user) continue

    const token = generateInviteToken(member.id, inviteDate)
    const invitationUrl = `${settings.url}/orgs/${org.id}/invitation?memberId=${member.id}&token=${token}`

    try {
      await sendMemberActivityEmail({
        recipients: [
          {
            Email: member.inviteEmail!,
            Name: member.name,
          },
        ],
        type: 'OrgInvitation',
        lang: adminMember.user.locale,
        replace: {
          member: adminMember.name,
          org: org.name,
        },
        picture: adminMember.picture || '',
        ctaUrl: invitationUrl,
      })
    } catch (e) {
      console.error(
        `Error resending invitation to member ${member.id}:`,
        e
      )
    }
  }
})

const GET_PENDING_INVITATIONS = gql(`
  query getPendingInvitations {
    member(
      where: {
        archivedAt: { _is_null: true }
        userId: { _is_null: true }
        inviteEmail: { _is_null: false }
        inviteDate: { _is_null: false }
      }
    ) {
      id
      name
      inviteDate
      inviteEmail
      org {
        id
        name
        members(
          where: {
            role: { _in: [Owner, Admin] }
            userId: { _is_null: false }
            archivedAt: { _is_null: true }
          }
          limit: 1
        ) {
          id
          name
          picture
          user {
            locale
          }
        }
      }
    }
  }
`)
