import useCurrentMember from '@/member/hooks/useCurrentMember'
import useOrgMember from '@/member/hooks/useOrgMember'
import useOrgOwner from '@/member/hooks/useOrgOwner'
import { useOrgContext } from '@/org/contexts/OrgContext'
import useCircleLeaders from '@/participants/hooks/useCircleLeaders'
import useCircleParticipants from '@/participants/hooks/useCircleParticipants'
import {
  CircleFragment,
  Governance_Mode_Enum,
  RoleSummaryFragment,
  useGetCircleQuery,
} from '@gql'
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
  const { governanceMode, editable, orgData, ready } = useOrgContext()
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

  // Free governance: every member can edit the whole org chart.
  const governanceOk = governanceMode === Governance_Mode_Enum.Free

  // Strict governance makes the whole chart read-only (changes go through
  // proposals). Read-only implementations (preview, share) disable edits too.
  const readOnly = !editable || governanceMode === Governance_Mode_Enum.Strict

  // Can edit circle
  const canEditCircle = isOrgMember && (governanceOk || isOrgOwner || isOwner)

  // Can edit role
  const canEditRole = role?.base ? isOrgOwner : canEditCircle

  // Can edit sub circles
  const canEditSubCircles =
    isOrgMember &&
    role?.singleMember === false &&
    role?.parentLink === false &&
    (governanceOk || isOrgOwner || isLeader)

  // Can edit sub-circles with parent link
  const canEditSubCirclesParentLinks =
    canEditCircle && role?.singleMember === false && role?.parentLink === false

  // Can edit members
  const canEditMembers =
    isOrgMember &&
    (governanceOk || isOrgOwner || (hasParentLinkMembers ? isLeader : isOwner))

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
      canEditCircle: readOnly ? false : canEditCircle,
      canEditRole: readOnly ? false : canEditRole,
      canEditMembers: readOnly ? false : canEditMembers,
      canEditSubCircles: readOnly ? false : canEditSubCircles,
      canEditSubCirclesParentLinks: readOnly
        ? false
        : canEditSubCirclesParentLinks,
    }

  return (
    <CircleContext.Provider value={value}>{children}</CircleContext.Provider>
  )
}
