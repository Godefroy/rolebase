import { isResultCertain } from '@rolebase/shared/helpers/resolveProposal'
import { webhookProcedure } from '../../trpc/webhookProcedure'
import { HasuraEvent } from '../../utils/nhost'
import { loadProposal } from './loadProposal'
import { applyResolution } from './resolution'

interface VoteRow {
  activityId: string
}

// Hasura event trigger on thread_proposal_vote (insert/update). Resolves the
// proposal automatically when everyone has voted, or as soon as the outcome is
// certain (when early resolution is enabled).
export default webhookProcedure.mutation(async (opts) => {
  const event = JSON.parse(opts.ctx.req.body as string) as HasuraEvent<VoteRow>
  const row = event.event.data.new ?? event.event.data.old
  const activityId = row?.activityId
  if (!activityId) return

  const loaded = await loadProposal(activityId)
  if (!loaded || loaded.data.status !== 'inProgress') return

  const allVoted =
    loaded.voterUserIds.length > 0 &&
    loaded.voterUserIds.every((userId) =>
      loaded.votes.some((v) => v.userId === userId)
    )

  const certain =
    loaded.data.earlyResolution &&
    isResultCertain(
      loaded.data.decisionMode,
      loaded.votes,
      loaded.voterUserIds.length
    )

  if (allVoted || certain) {
    await applyResolution(loaded)
  }
})
