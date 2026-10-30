import { useOrgContext } from '@/org/contexts/OrgContext'
import useUserMetadata from '@/user/hooks/useUserMetadata'
import { OrgChartTourStatus } from '@rolebase/shared/model/user'
import { useCallback } from 'react'

// Status of the org chart tour of the current org, for the current user:
// undefined until the org setup starts it
export default function useOrgChartTourStatus() {
  const { orgId } = useOrgContext()
  const { metadata, setMetadata } = useUserMetadata()
  const status = orgId ? metadata?.orgChartTours?.[orgId] : undefined

  const setStatus = useCallback(
    (newStatus: OrgChartTourStatus) => {
      if (!orgId) return
      return setMetadata('orgChartTours', {
        ...metadata?.orgChartTours,
        [orgId]: newStatus,
      })
    },
    [orgId, metadata, setMetadata]
  )

  return { status, setStatus }
}
