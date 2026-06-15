import { useOrgContext } from '@/org/contexts/OrgContext'
import {
  useGetOrgCirclesForRestoreLazyQuery,
  useUnarchiveCirclesMutation,
} from '@gql'
import { useCallback } from 'react'

// Restore an archived circle: unarchive it and all its descendant circles and
// their non-base roles.
export default function useRestoreCircle() {
  const { orgId } = useOrgContext()
  const [getCircles] = useGetOrgCirclesForRestoreLazyQuery()
  const [unarchiveCircles] = useUnarchiveCirclesMutation()

  return useCallback(
    async (circleId: string) => {
      if (!orgId) return

      // Load all circles (including archived) to walk the subtree
      const { data } = await getCircles({ variables: { orgId } })
      const circles = data?.circle
      const target = circles?.find((c) => c.id === circleId)
      if (!circles || !target) return

      // Walk the archived subtree (OrgData excludes archived circles, so the
      // descendants are collected directly from the raw query result here).
      const descendants = (id: string): typeof circles =>
        circles
          .filter((c) => c.parentId === id)
          .flatMap((c) => [c, ...descendants(c.id)])

      const subtree = [target, ...descendants(circleId)]
      const circlesIds = subtree.map((c) => c.id)
      const rolesIds = subtree.filter((c) => !c.role.base).map((c) => c.roleId)

      await unarchiveCircles({ variables: { circlesIds, rolesIds } })
    },
    [orgId]
  )
}
