import useCircleParticipants from '@/participants/hooks/useCircleParticipants'
import { ThreadContext } from '@/thread/contexts/ThreadContext'
import { ParticipantMember } from '@rolebase/shared/model/member'
import { ProposalVotersScope } from '@rolebase/shared/model/proposal'
import { useContext } from 'react'

// Resolve who can vote on a proposal: participants of the topic or of the role.
// There may be no thread yet (a proposal created from a role's Security menu),
// so the thread context is optional and a circle id can be passed as fallback.
export default function useProposalVoters(
  votersScope: ProposalVotersScope,
  circleId?: string
): ParticipantMember[] {
  const threadContext = useContext(ThreadContext)
  const circleParticipants = useCircleParticipants(
    threadContext?.circle?.id ?? circleId
  )
  return votersScope === 'circle'
    ? circleParticipants
    : threadContext?.participants ?? []
}
