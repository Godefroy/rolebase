import { roleSchema } from '@rolebase/shared/schemas'
import { TRPCError } from '@trpc/server'
import * as yup from 'yup'
import { Member_Role_Enum } from '../../gql'
import { guardMultipleOwnersOrg } from '../../guards/guardMultipleOwnersOrg'
import { guardOrg } from '../../guards/guardOrg'
import { authedProcedure } from '../../trpc/authedProcedure'
import { getMemberById } from './utils/getMemberById'
import { updateMember } from './utils/updateMember'
import { getOrgSubscriptionAndActiveMembers } from '../orgSubscription/utils/getOrgSubscriptionAndActiveMembers'
import { isSubscriptionActive } from '@rolebase/shared/model/subscription'
import { updateStripeSubscription } from '../orgSubscription/utils/stripe'

export default authedProcedure
  .input(
    yup.object().shape({
      memberId: yup.string().required(),
      role: roleSchema,
    })
  )
  .mutation(async (opts): Promise<void> => {
    const { memberId, role } = opts.input

    // Get member
    const memberToUpdate = await getMemberById(memberId)

    // Same rule as the webapp (MemberOrgRoleSelect): nobody changes their own
    // role, and only owners change an owner or appoint one.
    if (!opts.ctx.isAdmin && memberToUpdate.userId === opts.ctx.userId) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'You cannot change your own role',
      })
    }

    await guardOrg(
      memberToUpdate.orgId,
      memberToUpdate.role === Member_Role_Enum.Owner ||
        role === Member_Role_Enum.Owner
        ? Member_Role_Enum.Owner
        : Member_Role_Enum.Admin,
      opts.ctx
    )

    if (memberToUpdate.role === Member_Role_Enum.Owner) {
      // Ensures at least one other owner of the org will remain active
      await guardMultipleOwnersOrg(opts.ctx, memberToUpdate.orgId)
    }

    if (!memberToUpdate.role) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Member is not invited',
      })
    }

    if (!role) {
      // Remove role
      await updateMember(memberId, {
        userId: null,
        role: null,
        inviteEmail: null,
        inviteDate: null,
      })

      // Update subscription
      if (memberToUpdate.userId) {
        const { subscription, activeMembers } =
          await getOrgSubscriptionAndActiveMembers(memberToUpdate.orgId)

        if (
          subscription?.stripeSubscriptionId &&
          isSubscriptionActive(subscription.status)
        ) {
          await updateStripeSubscription(
            subscription.stripeSubscriptionId,
            activeMembers
          )
        }
      }
    } else if (role in Member_Role_Enum) {
      // Update role
      await updateMember(memberId, { role: role as Member_Role_Enum })
    } else {
      throw new TRPCError({ code: 'BAD_REQUEST', message: 'Invalid role' })
    }
  })
