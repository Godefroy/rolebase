import useCircleParticipants from '@/participants/hooks/useCircleParticipants'
import { ThreadContext } from '@/thread/contexts/ThreadContext'
import { ParticipantMember } from '@rolebase/shared/model/member'
import { ProposalVotersScope } from '@rolebase/shared/model/proposal'
import { useContext } from 'react'

// Resolve who can vote on a proposal: participants of the topic or of the role.
export default function useProposalVoters(
  votersScope: ProposalVotersScope
): ParticipantMember[] {
  const { participants, circle } = useContext(ThreadContext)!
  const circleParticipants = useCircleParticipants(circle?.id)
  return votersScope === 'circle' ? circleParticipants : participants
}
