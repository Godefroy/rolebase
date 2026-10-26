import { TRPCError } from '@trpc/server'
import { authedProcedure } from '../../trpc/authedProcedure'
import {
  deleteUserForGood,
  getActiveOrgs,
  getUserDeletionTarget,
} from '../deletion/utils/userDeletion'

// Deletes the current user's account for good. Refused while they are still
// a member of an active org: they leave it or delete it first.
export default authedProcedure
  .meta({ internal: true })
  .mutation(async (opts): Promise<void> => {
    const userId = opts.ctx.userId!
    const target = await getUserDeletionTarget(userId)
    if (!target) {
      throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found' })
    }
    if (getActiveOrgs(target).length > 0) {
      throw new TRPCError({
        code: 'PRECONDITION_FAILED',
        message: 'Leave or delete your organizations first',
      })
    }

    await deleteUserForGood(target)
    console.log(`[Deletion] ${userId} deleted their account`)
  })
