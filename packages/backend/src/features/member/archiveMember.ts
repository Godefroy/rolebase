import { TRPCError } from '@trpc/server'
import * as yup from 'yup'
import { Member_Role_Enum } from '../../gql'
import { guardOrg } from '../../guards/guardOrg'
import { authedProcedure } from '../../trpc/authedProcedure'
import { archiveMemberWithSeats } from './utils/archiveMemberWithSeats'
import { getMemberById } from './utils/getMemberById'

export default authedProcedure
  .input(
    yup.object().shape({
      memberId: yup.string().required(),
    })
  )
  .mutation(async (opts): Promise<void> => {
    const { memberId } = opts.input

    // Get member
    const memberToArchive = await getMemberById(memberId)

    // Members can't archive themselves: they leave the org (member.leaveOrg)
    if (memberToArchive.userId && memberToArchive.userId === opts.ctx.userId) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'You cannot archive yourself',
      })
    }

    await guardOrg(
      memberToArchive.orgId,
      memberToArchive.role === Member_Role_Enum.Owner
        ? Member_Role_Enum.Owner
        : Member_Role_Enum.Admin,
      opts.ctx
    )

    await archiveMemberWithSeats(opts.ctx, memberToArchive)
  })
