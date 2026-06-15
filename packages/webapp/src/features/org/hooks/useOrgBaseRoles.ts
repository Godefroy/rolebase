import { useOrgContext } from '@/org/contexts/OrgContext'
import { RoleSummaryFragment } from '@gql'
import { useMemo } from 'react'

export default function useOrgBaseRoles(): RoleSummaryFragment[] | undefined {
  const { orgData } = useOrgContext()
  return useMemo(
    () =>
      orgData?.roles
        .filter((r) => r.base)
        .sort((a, b) => a.name.localeCompare(b.name)),
    [orgData]
  )
}
