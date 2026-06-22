import useCurrentMember from '@/member/hooks/useCurrentMember'
import useOrgMember from '@/member/hooks/useOrgMember'
import useOrgOwner from '@/member/hooks/useOrgOwner'
import { useOrgContext } from '@/org/contexts/OrgContext'
import useCircleLeaders from '@/participants/hooks/useCircleLeaders'
import useCircleParticipants from '@/participants/hooks/useCircleParticipants'
import { CircleFragment, RoleSummaryFragment, useGetCircleQuery } from '@gql'
import { ParticipantMember } from '@rolebase/shared/model/member'
import React, { ReactNode, createContext } from 'react'

interface CircleContextValues {
  circle: CircleFragment
  parentCircle?: CircleFragment
  ownerCircle?: CircleFragment
  role: RoleSummaryFragment
  hasParentLinkMembers: boolean
  leaders: ParticipantMember[]
  participants: ParticipantMember[]
  owners: ParticipantMember[]
  isLeader: boolean
  isParticipant: boolean
  isOwner: boolean
  canEditCircle: boolean
  canEditRole: boolean
  canEditMembers: boolean
  canEditSubCircles: boolean
  canEditSubCirclesParentLinks: boolean
}

export const CircleContext = createContext<CircleContextValues | undefined>(
  undefined
)

interface Props {
  circleId: string
  children: ReactNode
}

export function CircleProvider({ circleId, children }: Props) {
  // Editability and governance come from the org context. In the proposal
  // editor it is an in-memory draft (Agile, editable).
  const { editable, orgData, ready } = useOrgContext()
  const orgCircle = orgData?.getCircle(circleId)
  const currentMember = useCurrentMember()
  const isOrgMember = useOrgMember()
  const isOrgOwner = useOrgOwner()

  // Archived circles aren't in the org data; fetch the circle and its role by
  // id (ignoring archived) so its panel can still be opened (with an alert).
  const { data: fetched } = useGetCircleQuery({
    skip: !circleId || !!orgCircle || !ready,
    variables: { id: circleId },
  })
  const fetchedCircle = fetched?.circle_by_pk
  const circle: CircleFragment | undefined = orgCircle ?? fetchedCircle ?? undefined
  const role = orgData?.getRole(circle?.roleId) ?? fetchedCircle?.role

  // Participants
  const participants = useCircleParticipants(circle)
  const isParticipant = participants.some(
    (p) => p.member.id === currentMember?.id
  )

  // Leaders (display list, real leaders only)
  const leaders = useCircleLeaders(circle)
  const hasParentLinkMembers = leaders.some(
    (p) => !p.circlesIds.includes(circleId)
  )

  // Parent circle
  const parentCircle = orgData?.getCircle(circle?.parentId || undefined)

  // Owner circle: grand parent circle if link to parent, else parent circle
  const grandParentCircle = orgData?.getCircle(
    (role?.parentLink && parentCircle?.parentId) || undefined
  )
  const ownerCircle = grandParentCircle || parentCircle

  // Owners = leaders of the owner circle. In the proposal editor the current
  // member is added to the thread circle's leaders (see OrgData.actingLeader),
  // which propagates here to both isLeader and isOwner.
  const owners = useCircleLeaders(ownerCircle)

  const isLeader = leaders.some((p) => p.member.id === currentMember?.id)
  const isOwner = owners.some((p) => p.member.id === currentMember?.id)

  // Permissions: the rules live in OrgData (single source of truth, mirrored by
  // the Hasura permissions). The caller gates them with `editable`, which is
  // false in read-only contexts (preview, share, in-memory draft).
  const perms =
    circle && role && orgData
      ? orgData.getCirclePermissions(
          circle,
          role,
          currentMember?.id,
          isOrgMember,
          isOrgOwner
        )
      : undefined

  // Prepare context value
  const value = circle &&
    role && {
      circle,
      parentCircle,
      ownerCircle,
      role,
      hasParentLinkMembers,
      leaders,
      participants,
      owners,
      isLeader,
      isParticipant,
      isOwner,
      canEditCircle: editable && !!perms?.canEditCircle,
      canEditRole: editable && !!perms?.canEditRole,
      canEditMembers: editable && !!perms?.canEditMembers,
      canEditSubCircles: editable && !!perms?.canEditSubCircles,
      canEditSubCirclesParentLinks:
        editable && !!perms?.canEditSubCirclesParentLinks,
    }

  return (
    <CircleContext.Provider value={value}>{children}</CircleContext.Provider>
  )
}
