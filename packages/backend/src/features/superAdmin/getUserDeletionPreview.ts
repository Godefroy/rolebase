import { TRPCError } from '@trpc/server'
import * as yup from 'yup'
import { adminProcedure } from '../../trpc/adminProcedure'
import {
  getUserDeletionPreview,
  getUserDeletionTarget,
  UserDeletionPreview,
} from '../deletion/utils/userDeletion'

export default adminProcedure
  .input(
    yup.object().shape({
      userId: yup.string().uuid().required(),
      orgIds: yup.array().of(yup.string().uuid().required()).default([]),
    })
  )
  .query(async (opts): Promise<UserDeletionPreview> => {
    const { userId, orgIds } = opts.input
    const target = await getUserDeletionTarget(userId, orgIds)
    if (!target) {
      throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found' })
    }
    return getUserDeletionPreview(target)
  })
