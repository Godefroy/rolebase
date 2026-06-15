import useCurrentMember from '@/member/hooks/useCurrentMember'
import useOrgMember from '@/member/hooks/useOrgMember'
import useOrgOwner from '@/member/hooks/useOrgOwner'
import { useOrgContext } from '@/org/contexts/OrgContext'
import useCircleLeaders from '@/participants/hooks/useCircleLeaders'
import { Governance_Mode_Enum } from '@gql'

// Whether the current user can add/edit/delete decisions of a circle.
// Mirrors CircleContext.canEditMembers ("comme pour l'ajout d'un membre"):
// allowed when governance is not protected, or the user has the rights to
// modify the circle's members.
export default function useCanEditDecisions(circleId?: string): boolean {
  const currentMember = useCurrentMember()
  const { governanceMode, orgData } = useOrgContext()
  const isOrgMember = useOrgMember()
  const isOrgOwner = useOrgOwner()

  const circle = orgData?.getCircle(circleId)
  const role = orgData?.getRole(circle?.roleId)

  // Leaders of the circle
  const leaders = useCircleLeaders(circle)
  const isLeader = leaders.some((p) => p.member.id === currentMember?.id)
  const hasParentLinkMembers = leaders.some(
    (p) => circle && !p.circlesIds.includes(circle.id)
  )

  // Owner circle: grand parent if link to parent, else parent
  const parentCircle = orgData?.getCircle(circle?.parentId || undefined)
  const grandParentCircle = orgData?.getCircle(
    (role?.parentLink && parentCircle?.parentId) || undefined
  )
  const ownerCircle = grandParentCircle || parentCircle
  const owners = useCircleLeaders(ownerCircle)
  const isOwner = owners.some((p) => p.member.id === currentMember?.id)

  return (
    isOrgMember &&
    (governanceMode === Governance_Mode_Enum.Free ||
      isOrgOwner ||
      (hasParentLinkMembers ? isLeader : isOwner))
  )
}
