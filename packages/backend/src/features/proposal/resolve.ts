import { TRPCError } from '@trpc/server'
import * as yup from 'yup'
import { Member_Role_Enum } from '../../gql'
import { guardOrg } from '../../guards/guardOrg'
import { authedProcedure } from '../../trpc/authedProcedure'
import { loadProposal } from './loadProposal'
import { applyResolution } from './resolution'

// Manual resolution triggered from the webapp. Allowed for the proposal author,
// a leader of the circle, or an org admin. Runs server-side so the changes are
// applied with admin rights (a voter may not have them).
export default authedProcedure
  .input(
    yup.object().shape({
      activityId: yup.string().required(),
    })
  )
  .mutation(async (opts) => {
    const loaded = await loadProposal(opts.input.activityId)
    if (!loaded) throw new TRPCError({ code: 'NOT_FOUND' })
    if (loaded.data.status !== 'inProgress') return

    const { userId, isAdmin } = opts.ctx
    const isAuthor = userId === loaded.authorUserId
    const isLeader = !!userId && loaded.leaderUserIds.includes(userId)
    if (!isAdmin && !isAuthor && !isLeader) {
      // Fall back to org admins / owners
      await guardOrg(loaded.orgId, Member_Role_Enum.Admin, opts.ctx)
    }

    await applyResolution(loaded)
  })
