import { ThreadContext } from '@/thread/contexts/ThreadContext'
import useCurrentMember from '@/member/hooks/useCurrentMember'
import { useAuth } from '@/user/hooks/useAuth'
import { UseDisclosureReturn, useDisclosure } from '@chakra-ui/react'
import {
  Thread_Activity_Type_Enum,
  ThreadProposalVoteFragment,
  useCreateThreadProposalVoteMutation,
  useThreadProposalVotesSubscription,
  useUpdateThreadActivityMutation,
  useUpdateThreadProposalVoteMutation,
} from '@gql'
import {
  ProposalVoteValue,
  ThreadActivityDataProposalEvent,
} from '@rolebase/shared/model/proposal'
import { ThreadActivityProposalFragment } from '@rolebase/shared/model/thread_activity'
import { trpc } from 'src/trpc'
import React, { createContext, useContext } from 'react'
import useCreateProposalEvent from '../hooks/useCreateProposalEvent'
import useProposalState from '../hooks/useProposalState'

interface ProposalContextValue {
  activity: ThreadActivityProposalFragment
  votes?: ThreadProposalVoteFragment[]
  state: ReturnType<typeof useProposalState>
  // Permissions
  canEdit: boolean
  canManage: boolean
  canDelete: boolean
  // Shared by two triggers (the layout edit icon and the manage menu), so the
  // edit modal lives in ProposalCard. Every other modal is local to its trigger.
  editModal: UseDisclosureReturn
  // Actions
  vote(value: ProposalVoteValue): void
  remind(): void
  cancel(): Promise<void>
  resolve(): void
}

const ProposalContext = createContext<ProposalContextValue | undefined>(
  undefined
)

export function useProposal() {
  const context = useContext(ProposalContext)
  if (!context) {
    throw new Error('useProposal must be used within a ProposalProvider')
  }
  return context
}

interface Props {
  activity: ThreadActivityProposalFragment
  children: React.ReactNode
}

export function ProposalProvider({ activity, children }: Props) {
  const { user } = useAuth()
  const currentMember = useCurrentMember()
  const { activities } = useContext(ThreadContext)!
  const editModal = useDisclosure()

  const { data } = useThreadProposalVotesSubscription({
    variables: { activityId: activity.id },
  })
  const votes = data?.thread_proposal_vote
  const hasVotes = (votes?.length || 0) > 0

  const state = useProposalState(activity, votes)
  const createProposalEvent = useCreateProposalEvent()

  const [createVote] = useCreateThreadProposalVoteMutation()
  const [updateVote] = useUpdateThreadProposalVoteMutation()
  const [updateActivity] = useUpdateThreadActivityMutation()

  const isUserOwner = user?.id === activity.userId
  // Author or a leader can manage the proposal (cancel / duplicate / remind)
  const canManage = state.canResolve || isUserOwner
  // The proposal can be edited by its author while in progress and not yet voted
  const canEdit = isUserOwner && state.inProgress && !hasVotes

  // Can be deleted only if no vote and no activity references it
  // (the layout further restricts deletion to the author or an admin)
  const hasReferencingActivity = !!activities?.some(
    (a) =>
      a.type === Thread_Activity_Type_Enum.ProposalEvent &&
      (a.data as ThreadActivityDataProposalEvent).proposalActivityId ===
        activity.id
  )
  const canDelete = !hasVotes && !hasReferencingActivity

  const vote = (value: ProposalVoteValue) => {
    if (state.userVote) {
      updateVote({
        variables: { id: state.userVote.id, values: { vote: value } },
      })
    } else if (currentMember) {
      createVote({
        variables: {
          values: {
            activityId: activity.id,
            memberId: currentMember.id,
            vote: value,
          },
        },
      })
    }
  }

  const remind = () =>
    createProposalEvent(activity.threadId, activity.id, 'voteReminder')

  // Cancel the proposal (duplication is handled by the manage menu afterwards).
  const cancel = async () => {
    await updateActivity({
      variables: {
        id: activity.id,
        values: {
          data: {
            ...activity.data,
            status: 'canceled',
            resolvedAt: new Date().toISOString(),
          },
        },
      },
    })
    await createProposalEvent(activity.threadId, activity.id, 'canceled')
  }

  // Resolution runs server-side (a voter may lack the rights to apply the org
  // chart changes). Automatic resolution is handled by a Hasura event trigger
  // (on vote) and a cron (resolution date); here we only trigger manual resolve.
  const resolve = () => {
    trpc.proposal.resolve.mutate({ activityId: activity.id })
  }

  return (
    <ProposalContext.Provider
      value={{
        activity,
        votes,
        state,
        canEdit,
        canManage,
        canDelete,
        editModal,
        vote,
        remind,
        cancel,
        resolve,
      }}
    >
      {children}
    </ProposalContext.Provider>
  )
}
