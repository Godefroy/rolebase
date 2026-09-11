import useCurrentMember from '@/member/hooks/useCurrentMember'
import useOrgMember from '@/member/hooks/useOrgMember'
import useOrgOwner from '@/member/hooks/useOrgOwner'
import { Governance_Mode_Enum } from '@gql'
import { useCallback, useMemo } from 'react'
import { useOrgContext } from '../contexts/OrgContext'

// Per-circle permissions for restructuring the chart, the same rules as the
// panels and the Hasura permissions, so an action is never offered (or
// partially performed) when the server would reject it. Shared by the graph
// drag & drop and the move modal.
export default function useOrgEditPermissions() {
  const isMember = useOrgMember()
  const isOrgOwner = useOrgOwner()
  const currentMember = useCurrentMember()
  const { orgData, editable, governanceMode } = useOrgContext()

  const getPerms = useCallback(
    (circleId: string) => {
      const circle = orgData?.getCircle(circleId)
      const role = circle && orgData?.getRole(circle.roleId)
      if (!orgData || !circle || !role || !editable) return undefined
      return orgData.getCirclePermissions(
        circle,
        role,
        currentMember?.id,
        isMember,
        isOrgOwner
      )
    },
    [orgData, editable, currentMember, isMember, isOrgOwner]
  )

  // Whether a sub-circle (parent-link or normal) may be added under a target
  // circle, or to the root (owner / Free only).
  const canAddSubCircleTo = useCallback(
    (targetCircleId: string | null, parentLink: boolean) => {
      if (!targetCircleId) {
        return (
          editable &&
          (isOrgOwner || governanceMode === Governance_Mode_Enum.Free)
        )
      }
      const perms = getPerms(targetCircleId)
      return parentLink
        ? !!perms?.canEditSubCirclesParentLinks
        : !!perms?.canEditSubCircles
    },
    [getPerms, editable, isOrgOwner, governanceMode]
  )

  return useMemo(
    () => ({ getPerms, canAddSubCircleTo }),
    [getPerms, canAddSubCircleTo]
  )
}
