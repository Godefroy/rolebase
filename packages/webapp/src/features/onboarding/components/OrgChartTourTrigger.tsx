import { useOrgRole } from '@/member/hooks/useOrgRole'
import { useOrgContext } from '@/org/contexts/OrgContext'
import { useNavigateOrg } from '@/org/hooks/useNavigateOrg'
import { Member_Role_Enum } from '@gql'
import { useEffect, useRef } from 'react'
import { track } from 'src/analytics'
import useOrgChartTourStatus from '../hooks/useOrgChartTourStatus'
import { isOrgFresh } from '../isOrgFresh'

// Lands owners and admins on the org chart with the tour running when they
// open a set-up org whose org chart is still empty (its root circle alone),
// even after a skipped or completed tour. Checked once per org opening: a tour
// skipped now stays skipped until the next visit. An org still to set up is
// left to OrgSetupTrigger, which starts the tour on finish.
export default function OrgChartTourTrigger() {
  const { orgId, org, orgData } = useOrgContext()
  const role = useOrgRole()
  const navigateOrg = useNavigateOrg()
  const { status, setStatus } = useOrgChartTourStatus()
  const checkedOrgId = useRef<string>()

  useEffect(() => {
    if (!orgId || !org || !orgData || !role) return
    if (checkedOrgId.current === orgId) return
    checkedOrgId.current = orgId

    const canEdit =
      role === Member_Role_Enum.Owner || role === Member_Role_Enum.Admin
    if (!canEdit || isOrgFresh(org, orgData) || orgData.circles.length > 1) {
      return
    }
    if (status !== 'started' && status !== 'replay' && status !== 'more') {
      track('org_tour_started', { relaunched: true })
      setStatus('started')
    }
    navigateOrg('roles')
  }, [orgId, org, orgData, role])

  return null
}
