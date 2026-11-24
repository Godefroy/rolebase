import useCurrentMember from '@/member/hooks/useCurrentMember'
import useOrgMember from '@/member/hooks/useOrgMember'
import { useOrgContext } from '@/org/contexts/OrgContext'
import useCircleParticipants from '@/participants/hooks/useCircleParticipants'
import useExtraParticipants from '@/participants/hooks/useExtraParticipants'
import { CircleFragment, MeetingFragment } from '@gql'
import { ParticipantMember } from '@rolebase/shared/model/member'

export interface MeetingPermissions {
  circle: CircleFragment | undefined
  participants: ParticipantMember[]
  isParticipant: boolean
  canEditSteps: boolean
  canEdit: boolean
}

// Who can edit a meeting and its steps
export default function useMeetingPermissions(
  meeting: MeetingFragment | undefined
): MeetingPermissions {
  const currentMember = useCurrentMember()
  const isMember = useOrgMember()
  const { orgData } = useOrgContext()

  const circle = orgData?.getCircle(meeting?.circleId)
  const circleParticipants = useCircleParticipants(circle)
  const participants = useExtraParticipants([], meeting?.meeting_attendees)

  // Is current member participant? circle participant?
  const isParticipant = currentMember
    ? participants.some((p) => p.member.id === currentMember.id)
    : false
  const isCircleParticipant = currentMember
    ? circleParticipants.some((p) => p.member.id === currentMember.id)
    : false

  // Current member can edit meeting steps?
  const canEditSteps =
    isCircleParticipant || (meeting?.invitedReadonly === false && isParticipant)

  // Current member can edit meeting?
  const canEdit =
    canEditSteps ||
    (meeting?.private === false &&
      meeting?.invitedReadonly === false &&
      isMember)

  return { circle, participants, isParticipant, canEditSteps, canEdit }
}
