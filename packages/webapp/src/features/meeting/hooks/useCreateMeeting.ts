import useCurrentMember from '@/member/hooks/useCurrentMember'
import { usePathInOrg } from '@/org/hooks/usePathInOrg'
import { Meeting_Insert_Input, useCreateMeetingMutation } from '@gql'
import { useCallback } from 'react'
import { track } from 'src/analytics'
import { useDuplicateMeetingSteps } from './useDuplicateMeetingSteps'

export default function useCreateMeeting() {
  const currentMember = useCurrentMember()
  const meetingsPath = usePathInOrg('meetings')
  const [createMeeting] = useCreateMeetingMutation()
  const duplicateMeetingSteps = useDuplicateMeetingSteps()

  return useCallback(
    async (meeting: Meeting_Insert_Input, duplicateMeetingId?: string) => {
      if (!currentMember) return

      // Create meeting
      const { data, errors } = await createMeeting({
        variables: {
          values: meeting,
        },
      })
      const newMeeting = data?.insert_meeting_one
      if (!newMeeting) return console.error(errors)

      track('meeting_created', {
        recurring: !!meeting.recurringId,
        duplicated: !!duplicateMeetingId,
      })

      const path = `${meetingsPath}/${newMeeting.id}`

      if (duplicateMeetingId) {
        // Duplicate steps
        await duplicateMeetingSteps(duplicateMeetingId, newMeeting)
      }

      return { id: newMeeting.id, path }
    },
    [currentMember, duplicateMeetingSteps, meetingsPath]
  )
}
