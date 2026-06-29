import useCurrentMember from '@/member/hooks/useCurrentMember'
import {
  Thread_Activity_Type_Enum,
  useCreateThreadActivityMutation,
} from '@gql'
import {
  ProposalEventType,
  ThreadActivityDataProposalEvent,
} from '@rolebase/shared/model/proposal'
import { useCallback } from 'react'

type EventExtra = Omit<
  ThreadActivityDataProposalEvent,
  'proposalActivityId' | 'event'
>

// Append a generic proposal event (resolution, edit, cancellation, reminder)
// to the thread.
export default function useCreateProposalEvent() {
  const currentMember = useCurrentMember()
  const [createActivity] = useCreateThreadActivityMutation()

  return useCallback(
    (
      threadId: string,
      proposalActivityId: string,
      event: ProposalEventType,
      extra?: EventExtra
    ) =>
      createActivity({
        variables: {
          values: {
            threadId,
            memberId: currentMember?.id,
            type: Thread_Activity_Type_Enum.ProposalEvent,
            data: { proposalActivityId, event, ...extra },
          },
        },
      }),
    [currentMember?.id]
  )
}
