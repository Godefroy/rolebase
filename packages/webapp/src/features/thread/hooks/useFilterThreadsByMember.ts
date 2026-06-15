import { useOrgContext } from '@/org/contexts/OrgContext'
import { ThreadFragment } from '@gql'
import { useMemo } from 'react'

export default function useFilterThreadsByMember<Entity extends ThreadFragment>(
  threads: Entity[] | undefined,
  memberId?: string
): Entity[] | undefined {
  const { orgData } = useOrgContext()

  // Filter entries
  return useMemo(
    () => threads && (orgData ? orgData.filterThreads(threads, memberId) : threads),
    [threads, memberId, orgData]
  )
}
