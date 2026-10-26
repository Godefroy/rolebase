import { TRPCError } from '@trpc/server'
import * as yup from 'yup'
import { gql } from '../../gql'
import { adminProcedure } from '../../trpc/adminProcedure'
import { adminRequest } from '../../utils/adminRequest'

// Disables a user account (sign-in refused) or enables it again
export default adminProcedure
  .input(
    yup.object().shape({
      userId: yup.string().uuid().required(),
      disabled: yup.boolean().required(),
    })
  )
  .mutation(async (opts): Promise<void> => {
    const { userId, disabled } = opts.input
    if (userId === opts.ctx.userId) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'You cannot disable yourself',
      })
    }

    const { updateUser } = await adminRequest(SET_USER_DISABLED, {
      userId,
      disabled,
    })
    if (!updateUser) {
      throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found' })
    }

    console.log(
      `[Admin] ${opts.ctx.userId} ${disabled ? 'disabled' : 'enabled'} user ${userId}`
    )
  })

const SET_USER_DISABLED = gql(`
  mutation setUserDisabled($userId: uuid!, $disabled: Boolean!) {
    updateUser(pk_columns: { id: $userId }, _set: { disabled: $disabled }) {
      id
    }
  }
`)
