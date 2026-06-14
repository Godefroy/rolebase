import useCircle from '@/circle/hooks/useCircle'
import useCurrentMember from '@/member/hooks/useCurrentMember'
import useOrgMember from '@/member/hooks/useOrgMember'
import useOrgOwner from '@/member/hooks/useOrgOwner'
import useCurrentOrg from '@/org/hooks/useCurrentOrg'
import useCircleLeaders from '@/participants/hooks/useCircleLeaders'

// Whether the current user can add/edit/delete decisions of a circle.
// Mirrors CircleContext.canEditMembers ("comme pour l'ajout d'un membre"):
// allowed when governance is not protected, or the user has the rights to
// modify the circle's members.
export default function useCanEditDecisions(circleId?: string): boolean {
  const currentMember = useCurrentMember()
  const org = useCurrentOrg()
  const isOrgMember = useOrgMember()
  const isOrgOwner = useOrgOwner()

  const circle = useCircle(circleId)
  const role = circle?.role

  // Leaders of the circle
  const leaders = useCircleLeaders(circle)
  const isLeader = leaders.some((p) => p.member.id === currentMember?.id)
  const hasParentLinkMembers = leaders.some(
    (p) => circle && !p.circlesIds.includes(circle.id)
  )

  // Owner circle: grand parent if link to parent, else parent
  const parentCircle = useCircle(circle?.parentId || undefined)
  const grandParentCircle = useCircle(
    (role?.parentLink && parentCircle?.parentId) || undefined
  )
  const ownerCircle = grandParentCircle || parentCircle
  const owners = useCircleLeaders(ownerCircle)
  const isOwner = owners.some((p) => p.member.id === currentMember?.id)

  return (
    isOrgMember &&
    (!org?.protectGovernance ||
      isOrgOwner ||
      (hasParentLinkMembers ? isLeader : isOwner))
  )
}
