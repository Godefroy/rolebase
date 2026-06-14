import useCircleLeaders from '@/participants/hooks/useCircleLeaders'
import { ThreadContext } from '@/thread/contexts/ThreadContext'
import { useAuth } from '@/user/hooks/useAuth'
import useCurrentMember from '@/member/hooks/useCurrentMember'
import { ThreadProposalVoteFragment } from '@gql'
import { resolveProposal } from '@rolebase/shared/helpers/resolveProposal'
import { ThreadActivityProposalFragment } from '@rolebase/shared/model/thread_activity'
import { useContext, useMemo } from 'react'
import useProposalVoters from './useProposalVoters'

export default function useProposalState(
  activity: ThreadActivityProposalFragment,
  votes?: ThreadProposalVoteFragment[]
) {
  const { user } = useAuth()
  const currentMember = useCurrentMember()
  const { circle } = useContext(ThreadContext)!
  const participants = useProposalVoters(activity.data.votersScope)
  const leaders = useCircleLeaders(circle?.id)

  const inProgress = activity.data.status === 'inProgress'

  // Current user's vote
  const userVote = useMemo(
    () => user && votes?.find((v) => v.userId === user.id),
    [user?.id, votes]
  )

  // Result preview from the current votes
  const result = useMemo(
    () => resolveProposal(activity.data.decisionMode, votes || [], participants.length),
    [activity.data.decisionMode, votes, participants.length]
  )

  // Author or a circle leader can resolve manually at any time
  const isAuthor = activity.userId === user?.id
  const isLeader = leaders.some((p) => p.member.id === currentMember?.id)
  const canResolve = inProgress && (isAuthor || isLeader)

  // Only the voters (participants of the thread or the role) can vote
  const isVoter = participants.some((p) => p.member.id === currentMember?.id)

  return {
    inProgress,
    userVote,
    result,
    canResolve,
    isAuthor,
    isVoter,
    votersCount: participants.length,
  }
}
