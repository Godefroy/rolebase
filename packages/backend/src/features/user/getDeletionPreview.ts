import { TRPCError } from '@trpc/server'
import { authedProcedure } from '../../trpc/authedProcedure'
import {
  getUserDeletionPreview,
  getUserDeletionTarget,
  UserDeletionPreview,
} from '../deletion/utils/userDeletion'

// Lists what deleting the current user's account would delete or unlink
export default authedProcedure
  .meta({ internal: true })
  .query(async (opts): Promise<UserDeletionPreview> => {
    const target = await getUserDeletionTarget(opts.ctx.userId!)
    if (!target) {
      throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found' })
    }
    return getUserDeletionPreview(target)
  })
