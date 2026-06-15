import { useOrgContext } from '@/org/contexts/OrgContext'
import { EntityWithScope } from '@rolebase/shared/model/participants'
import { useMemo } from 'react'

export default function useFilterScopedEntitiesByMember<
  Entity extends EntityWithScope,
>(data: Entity[] | undefined, memberId?: string): Entity[] | undefined {
  const { orgData } = useOrgContext()

  // Filter entries
  return useMemo(
    () => data && (orgData ? orgData.filterScopedEntities(data, memberId) : data),
    [data, memberId, orgData]
  )
}
