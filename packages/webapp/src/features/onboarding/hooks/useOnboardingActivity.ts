import { useOrgContext } from '@/org/contexts/OrgContext'
import { useOnboardingActivitySubscription } from '@gql'

// Whether the org already has a recurring meeting, a held meeting, a thread
// and a decision
export default function useOnboardingActivity(skip = false) {
  const { orgId } = useOrgContext()
  const { data, loading } = useOnboardingActivitySubscription({
    skip: skip || !orgId,
    variables: { orgId: orgId! },
  })

  const org = data?.org_by_pk
  return {
    loading: loading || !data,
    hasRecurringMeeting: !!org?.meetings_recurring.length,
    hasHeldMeeting: !!org?.meetings.length,
    hasThread: !!org?.threads.length,
    hasDecision: !!org?.decisions.length,
  }
}
