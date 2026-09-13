import useOnboardingActivity from '@/onboarding/hooks/useOnboardingActivity'
import { useOrgContext } from '@/org/contexts/OrgContext'
import { UserLocalStorageKeys } from '@utils/localStorage'
import { useEffect } from 'react'
import { track } from 'src/analytics'

const day = 24 * 60 * 60 * 1000
const RETURN_DAYS = [1, 7, 30]
const ACTIVATION_DAYS = 7

interface Tracked {
  returned: number[]
  activated?: boolean
}

// Lifecycle events of young orgs, sent once per browser:
// - org_returned: the org is opened again 1, 7 or 30 days after its creation
// - activation_reached: within 7 days, at least 2 accounts and a first
//   collaborative object (held meeting, thread or decision)
// The database stays the reliable per-org source; these events make the same
// funnel readable in Umami.
export default function useOrgLifecycleTracking() {
  const { orgId, org, orgData } = useOrgContext()
  const ageDays = org
    ? (Date.now() - new Date(org.createdAt).getTime()) / day
    : 0
  const isYoung = !!org && ageDays <= Math.max(...RETURN_DAYS) + 1
  const activity = useOnboardingActivity(!isYoung)
  const accounts = orgData?.members.filter((m) => !!m.userId).length ?? 0

  useEffect(() => {
    if (!orgId || !isYoung || activity.loading) return
    const key = UserLocalStorageKeys.OrgLifecycleTracked.replace('{id}', orgId)

    let tracked: Tracked = { returned: [] }
    try {
      tracked = JSON.parse(localStorage.getItem(key) || '') || tracked
    } catch {
      // First visit, or storage unavailable
    }

    const reached = RETURN_DAYS.filter(
      (days) => ageDays >= days && !tracked.returned.includes(days)
    )
    for (const days of reached) track('org_returned', { days })

    const activated =
      !tracked.activated &&
      ageDays <= ACTIVATION_DAYS &&
      accounts >= 2 &&
      (activity.hasHeldMeeting || activity.hasThread || activity.hasDecision)
    if (activated) track('activation_reached', { accounts })

    if (reached.length || activated) {
      try {
        localStorage.setItem(
          key,
          JSON.stringify({
            returned: [...tracked.returned, ...reached],
            activated: tracked.activated || activated,
          })
        )
      } catch {
        // Storage unavailable: events may be sent again next time
      }
    }
  }, [
    orgId,
    isYoung,
    activity.loading,
    accounts,
    activity.hasHeldMeeting,
    activity.hasThread,
    activity.hasDecision,
  ])
}
