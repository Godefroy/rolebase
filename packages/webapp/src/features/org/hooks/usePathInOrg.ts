import { useOrgContext } from '@/org/contexts/OrgContext'
import { getOrgPath } from '@rolebase/shared/helpers/getOrgPath'

export function usePathInOrg(path: string) {
  const { orgId, org } = useOrgContext()
  if (!org && !orgId) return ''

  return `${org ? getOrgPath(org) : `/orgs/${orgId}`}/${path}`
}
