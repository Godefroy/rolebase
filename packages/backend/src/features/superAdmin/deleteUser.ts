import { TRPCError } from '@trpc/server'
import * as yup from 'yup'
import { adminProcedure } from '../../trpc/adminProcedure'
import {
  cancelOrgSubscriptions,
  deleteFiles,
  deleteOrgs,
} from './utils/orgDeletion'
import {
  eraseUserAccount,
  getUserDeletionTarget,
  getUserFileIds,
} from './utils/userDeletion'

// Erases a person (GDPR): deletes the orgs nobody else took part in, unlinks
// their members from the other orgs (left untouched otherwise), and deletes
// or anonymizes the account depending on what these orgs still reference.
export default adminProcedure
  .input(
    yup.object().shape({
      userId: yup.string().uuid().required(),
    })
  )
  .mutation(async (opts): Promise<{ failedFiles: number }> => {
    const { userId } = opts.input
    if (userId === opts.ctx.userId) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'You cannot delete yourself',
      })
    }

    const target = await getUserDeletionTarget(userId)
    if (!target) {
      throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found' })
    }

    // Files are listed before their references disappear
    const fileIds = await getUserFileIds(target)
    await cancelOrgSubscriptions(target.soloOrgIds)
    await deleteOrgs(target.soloOrgIds)
    await eraseUserAccount(target)
    const failedFiles = await deleteFiles(fileIds)

    console.log(`[Deletion] ${opts.ctx.userId} deleted user ${userId}`)
    return { failedFiles }
  })
