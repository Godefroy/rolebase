import { TRPCError } from '@trpc/server'
import * as yup from 'yup'
import { Member_Role_Enum } from '../../gql'
import { guardOrg } from '../../guards/guardOrg'
import { authedProcedure } from '../../trpc/authedProcedure'
import { getMemberById } from './utils/getMemberById'
import { updateMember } from './utils/updateMember'

// Restore an archived member (unarchive). Archiving cleared the member's user
// link and org role, so restoring brings back the member entity only; it is not
// re-linked to a user account.
export default authedProcedure
  .input(
    yup.object().shape({
      memberId: yup.string().required(),
    })
  )
  .mutation(async (opts): Promise<void> => {
    const { memberId } = opts.input

    const member = await getMemberById(memberId)
    if (!member) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Member does not exist',
      })
    }

    await guardOrg(member.orgId, Member_Role_Enum.Admin, opts.ctx)

    return updateMember(memberId, { archivedAt: null })
  })
