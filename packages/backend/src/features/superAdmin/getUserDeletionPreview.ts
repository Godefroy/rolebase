import { TRPCError } from '@trpc/server'
import * as yup from 'yup'
import { adminProcedure } from '../../trpc/adminProcedure'
import {
  getUserDeletionPreview,
  getUserDeletionTarget,
  UserDeletionPreview,
} from './utils/userDeletion'

export default adminProcedure
  .input(
    yup.object().shape({
      userId: yup.string().uuid().required(),
    })
  )
  .query(async (opts): Promise<UserDeletionPreview> => {
    const target = await getUserDeletionTarget(opts.input.userId)
    if (!target) {
      throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found' })
    }
    return getUserDeletionPreview(target)
  })
