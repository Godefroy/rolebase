import { isSubscriptionActive } from '@rolebase/shared/model/subscription'
import { Member_Role_Enum } from '../../../gql'
import { guardMultipleOwnersOrg } from '../../../guards/guardMultipleOwnersOrg'
import { Context } from '../../../trpc/context'
import { getOrgSubscriptionAndActiveMembers } from '../../orgSubscription/utils/getOrgSubscriptionAndActiveMembers'
import { updateStripeSubscription } from '../../orgSubscription/utils/stripe'
import { updateMember } from './updateMember'

// Archives a member, keeping at least one owner in the org and updating the
// number of seats of its subscription
export async function archiveMemberWithSeats(
  ctx: Context,
  member: {
    id: string
    orgId: string
    userId?: string | null
    role?: Member_Role_Enum | null
  }
) {
  if (member.role === Member_Role_Enum.Owner) {
    // Ensures at least one owner of the org will remain active
    await guardMultipleOwnersOrg(ctx, member.orgId)
  }

  // Update subscription
  if (member.userId) {
    const { subscription, activeMembers } =
      await getOrgSubscriptionAndActiveMembers(member.orgId)

    if (
      subscription?.stripeSubscriptionId &&
      isSubscriptionActive(subscription.status)
    ) {
      await updateStripeSubscription(
        subscription.stripeSubscriptionId,
        activeMembers - 1
      )
    }
  }

  await updateMember(member.id, {
    userId: null,
    role: null,
    archivedAt: new Date().toISOString(),
    inviteDate: null,
    inviteEmail: null,
  })
}
