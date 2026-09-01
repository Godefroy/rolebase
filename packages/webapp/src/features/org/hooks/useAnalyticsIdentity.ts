import { useOrgContext } from '@/org/contexts/OrgContext'
import { useEffect } from 'react'
import { identify } from 'src/analytics'

// Attaches the current organization to the analytics session, so any funnel can
// be replayed filtered by plan, org type or size. Umami merges session data, so
// this completes the user attributes already sent by AuthProvider.
export default function useAnalyticsIdentity() {
  const { orgId, org, subscription, orgData } = useOrgContext()

  useEffect(() => {
    if (!orgId) return
    identify({
      orgId,
      // The org type lives on `org.onboardingOrgType`, outside the Org
      // fragment: it is carried by the `org_setup_*` events instead.
      governanceMode: org?.governanceMode,
      plan: subscription?.type ?? 'free',
      seats: orgData?.members.filter((member) => !!member.userId).length,
    })
  }, [orgId, org?.governanceMode, subscription?.type, orgData?.members])
}
