import Markdown from '@/common/atoms/Markdown'
import { useAuth } from '@/user/hooks/useAuth'
import CollabEditor from '@/editor/components/CollabEditor'
import MeetingItem from '@/meeting/components/MeetingItem'
import { MeetingContext } from '@/meeting/contexts/MeetingContext'
import { Card, CardBody, CardHeader, Heading, Text } from '@chakra-ui/react'
import { useUpdateThreadActivityMutation } from '@gql'
import { ThreadActivityMeetingNoteFragment } from '@rolebase/shared/model/thread_activity'
import React, { useCallback, useContext } from 'react'
import { useTranslation } from 'react-i18next'
import useCreateThreadMeetingNote from '../hooks/useCreateThreadMeetingNote'
import { activityMeetingNoteTmpId } from './ThreadActivities'
import ThreadActivityAnchor from './ThreadActivityAnchor'

interface Props {
  activity: ThreadActivityMeetingNoteFragment
}

export default function ThreadActivityMeetingNote({ activity }: Props) {
  const { t } = useTranslation()

  // Meeting state, defined if thread has been opened from a meeting
  const meetingState = useContext(MeetingContext)
  const meeting = activity.refMeeting

  const createThreadMeetingNote = useCreateThreadMeetingNote()
  const [updateThreadActivity] = useUpdateThreadActivityMutation()

  const isEditable =
    meetingState?.editable &&
    meetingState.meeting?.id === activity.refMeeting?.id

  // Update notes
  const handleNotesChange = useCallback(
    async (notes: string) => {
      if (!meeting) return
      if (activity.id === activityMeetingNoteTmpId) {
        createThreadMeetingNote(activity.threadId, meeting.id, notes)
      } else {
        updateThreadActivity({
          variables: {
            id: activity.id,
            values: { data: { notes } },
          },
        })
      }
    },
    [activity, meeting]
  )

  if (!isEditable && !activity.data.notes) {
    return <ThreadActivityAnchor activityId={activity.id} />
  }

  return (
    <Card m={5} variant="activity">
      <ThreadActivityAnchor activityId={activity.id} />

      <CardHeader>
        <Heading as="h3" fontSize="md">
          {t(`ThreadActivityMeetingNote.title`)}
        </Heading>
      </CardHeader>
      <CardBody pt={0}>
        {meeting ? (
          <>
            <MeetingItem meeting={meeting} showDate showIcon mb={2} mx={-2} />

            {isEditable ? (
              <CollabEditor
                docId={`thread-${activity.threadId}-meeting-${meeting.id}`}
                value={activity.data.notes}
                placeholder={t('MeetingStepContent.notesPlaceholder')}
                minH="80px"
                saveEvery={10000}
                onSave={handleNotesChange}
              />
            ) : (
              <Markdown>{activity.data.notes}</Markdown>
            )}
          </>
        ) : (
          <Text fontStyle="italic">{t('MeetingStepContent.notAllowed')}</Text>
        )}
      </CardBody>
    </Card>
  )
}
