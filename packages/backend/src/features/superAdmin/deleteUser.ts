import { TRPCError } from '@trpc/server'
import * as yup from 'yup'
import { adminProcedure } from '../../trpc/adminProcedure'
import {
  deleteUserForGood,
  getUserDeletionTarget,
} from '../deletion/utils/userDeletion'

// Erases a person (GDPR): deletes the orgs they own alone or nobody else took
// part in, plus the co-owned orgs selected in orgIds, unlinks their members
// from the other orgs (left untouched otherwise), and deletes or anonymizes
// the account depending on what these orgs still reference.
export default adminProcedure
  .input(
    yup.object().shape({
      userId: yup.string().uuid().required(),
      orgIds: yup.array().of(yup.string().uuid().required()).default([]),
    })
  )
  .mutation(async (opts): Promise<{ failedFiles: number }> => {
    const { userId, orgIds } = opts.input
    if (userId === opts.ctx.userId) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'You cannot delete yourself',
      })
    }

    const target = await getUserDeletionTarget(userId, orgIds)
    if (!target) {
      throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found' })
    }
    const failedFiles = await deleteUserForGood(target)

    console.log(`[Deletion] ${opts.ctx.userId} deleted user ${userId}`)
    return { failedFiles }
  })
