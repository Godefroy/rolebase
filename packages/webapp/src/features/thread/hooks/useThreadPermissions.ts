import useCurrentMember from '@/member/hooks/useCurrentMember'
import useOrgMember from '@/member/hooks/useOrgMember'
import { useOrgContext } from '@/org/contexts/OrgContext'
import useCircleParticipants from '@/participants/hooks/useCircleParticipants'
import useExtraParticipants from '@/participants/hooks/useExtraParticipants'
import { CircleFragment, ThreadFragment } from '@gql'
import { ParticipantMember } from '@rolebase/shared/model/member'

export interface ThreadPermissions {
  circle: CircleFragment | undefined
  participants: ParticipantMember[]
  isParticipant: boolean
  canEdit: boolean
}

// Who can edit a thread: its participants, or any org member when it's public
export default function useThreadPermissions(
  thread: ThreadFragment | undefined
): ThreadPermissions {
  const currentMember = useCurrentMember()
  const isMember = useOrgMember()
  const { orgData } = useOrgContext()

  const circle = orgData?.getCircle(thread?.circleId)
  const circleParticipants = useCircleParticipants(circle)
  const participants = useExtraParticipants(
    circleParticipants,
    thread?.extra_members
  )

  const isParticipant = currentMember
    ? participants.some((p) => p.member.id === currentMember.id)
    : false
  const canEdit = isParticipant || (thread?.private === false && isMember)

  return { circle, participants, isParticipant, canEdit }
}
