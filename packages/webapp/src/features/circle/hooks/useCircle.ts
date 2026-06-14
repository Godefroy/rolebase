import { useOrgData } from '@/org/contexts/OrgDataContext'
import { CircleFullFragment } from '@gql'
import { useMemo } from 'react'

export default function useCircle(id?: string): CircleFullFragment | undefined {
  const { circles } = useOrgData()
  return useMemo(
    () => (id ? circles?.find((c) => c.id === id) : undefined),
    [circles, id]
  )
}
