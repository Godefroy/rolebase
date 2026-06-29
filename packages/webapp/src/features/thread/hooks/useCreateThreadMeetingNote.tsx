import useCurrentMember from '@/member/hooks/useCurrentMember'
import {
  Thread_Activity_Type_Enum,
  useCreateThreadActivityMutation,
} from '@gql'
import { useCallback } from 'react'

export default function useCreateThreadMeetingNote() {
  const currentMember = useCurrentMember()
  const [createThreadActivity] = useCreateThreadActivityMutation()

  // Update notes
  return useCallback(
    async (threadId: string, meetingId: string, notes: string) => {
      // Create activity
      await createThreadActivity({
        variables: {
          values: {
            threadId,
            memberId: currentMember?.id,
            type: Thread_Activity_Type_Enum.MeetingNote,
            refMeetingId: meetingId,
            data: {
              notes,
            },
          },
        },
      })
    },
    [currentMember?.id]
  )
}
