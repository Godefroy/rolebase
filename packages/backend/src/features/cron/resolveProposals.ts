import { ThreadActivityDataProposal } from '@rolebase/shared/model/proposal'
import { Thread_Activity_Type_Enum, gql } from '../../gql'
import { webhookProcedure } from '../../trpc/webhookProcedure'
import { adminRequest } from '../../utils/adminRequest'
import { loadProposal } from '../proposal/loadProposal'
import { applyResolution } from '../proposal/resolution'

// Only in-progress proposals (a date deadline can't be compared server-side on
// a jsonb subfield, so the date is checked in memory over this small set).
const GET_PROPOSALS = gql(`
  query getProposalsForCron($type: thread_activity_type_enum!) {
    thread_activity(
      where: {
        type: { _eq: $type }
        data: { _contains: { status: "inProgress" } }
      }
    ) {
      id
      data
    }
  }
`)

// Resolve proposals whose resolution deadline has passed. Runs every few minutes.
export default webhookProcedure.mutation(async () => {
  const now = Date.now()
  const { thread_activity } = await adminRequest(GET_PROPOSALS, {
    type: Thread_Activity_Type_Enum.Proposal,
  })

  const due = thread_activity.filter((activity) => {
    const data = activity.data as ThreadActivityDataProposal
    return (
      !!data.resolutionDate && new Date(data.resolutionDate).getTime() <= now
    )
  })

  for (const activity of due) {
    const loaded = await loadProposal(activity.id)
    if (loaded && loaded.data.status === 'inProgress') {
      await applyResolution(loaded)
    }
  }
})
