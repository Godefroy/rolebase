import useCurrentMember from '@/member/hooks/useCurrentMember'
import useOrgMember from '@/member/hooks/useOrgMember'
import useOrgOwner from '@/member/hooks/useOrgOwner'
import useCurrentOrg from '@/org/hooks/useCurrentOrg'
import useCircleLeaders from '@/participants/hooks/useCircleLeaders'
import useCircleParticipants from '@/participants/hooks/useCircleParticipants'
import { CircleFullFragment, RoleSummaryFragment } from '@gql'
import { ParticipantMember } from '@rolebase/shared/model/member'
import React, { ReactNode, createContext } from 'react'
import useCircle from '../hooks/useCircle'

interface CircleContextValues {
  circle: CircleFullFragment
  parentCircle?: CircleFullFragment
  ownerCircle?: CircleFullFragment
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
  // Force the whole panel read-only (e.g. previewing a proposal's org chart)
  readOnly?: boolean
  // Editing a draft (proposal org chart editor): lift governance restrictions
  // since changes are only applied on approval. Any org member can prepare them.
  isDraft?: boolean
  children: ReactNode
}

export function CircleProvider({
  circleId,
  readOnly,
  isDraft,
  children,
}: Props) {
  const circle = useCircle(circleId)
  const role = circle?.role
  const currentMember = useCurrentMember()
  const org = useCurrentOrg()
  const isOrgMember = useOrgMember()
  const isOrgOwner = useOrgOwner()

  // Participants
  const participants = useCircleParticipants(circle)
  const isParticipant = participants.some(
    (p) => p.member.id === currentMember?.id
  )

  // Leaders
  const leaders = useCircleLeaders(circle)
  const isLeader = leaders.some((p) => p.member.id === currentMember?.id)
  const hasParentLinkMembers = leaders.some(
    (p) => !p.circlesIds.includes(circleId)
  )

  // Parent circle
  const parentCircle = useCircle(circle?.parentId || undefined)

  // Owner circle: grand parent circle if link to parent, else parent circle
  const grandParentCircle = useCircle(
    (role?.parentLink && parentCircle?.parentId) || undefined
  )
  const ownerCircle = grandParentCircle || parentCircle

  // Parent owners
  const owners = useCircleLeaders(ownerCircle)
  const isOwner = owners.some((p) => p.member.id === currentMember?.id)

  // In a draft (proposal editor), governance protection is lifted: any org
  // member can prepare changes since they only apply on approval.
  const governanceOk = isDraft || !org?.protectGovernance

  // Can edit circle
  const canEditCircle =
    isOrgMember && (governanceOk || isOrgOwner || isOwner)

  // Can edit role
  const canEditRole = role?.base
    ? isDraft || isOrgOwner
    : canEditCircle

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
    (governanceOk ||
      isOrgOwner ||
      (hasParentLinkMembers ? isLeader : isOwner))

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
