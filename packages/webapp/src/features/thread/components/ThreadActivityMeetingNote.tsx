import Markdown from '@/common/atoms/Markdown'
import CollabEditor from '@/editor/components/CollabEditor'
import MeetingItem from '@/meeting/components/MeetingItem'
import { MeetingContext } from '@/meeting/contexts/MeetingContext'
import { Card, CardBody, CardHeader, Heading, Text } from '@chakra-ui/react'
import { ThreadActivityMeetingNoteFragment } from '@rolebase/shared/model/thread_activity'
import React, { useContext } from 'react'
import { useTranslation } from 'react-i18next'
import ThreadActivityAnchor from './ThreadActivityAnchor'

interface Props {
  activity: ThreadActivityMeetingNoteFragment
}

export default function ThreadActivityMeetingNote({ activity }: Props) {
  const { t } = useTranslation()

  // Meeting state, defined if thread has been opened from a meeting
  const meetingState = useContext(MeetingContext)
  const meeting = activity.refMeeting

  const isEditable =
    meetingState?.editable &&
    meetingState.meeting?.id === activity.refMeeting?.id

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
            <MeetingItem
              meeting={meeting}
              showDate
              showIcon
              openButton
              maxW="2xl"
              mb={2}
              mx={-2}
            />

            {isEditable ? (
              <CollabEditor
                docId={`thread-${activity.threadId}-meeting-${meeting.id}`}
                placeholder={t('MeetingStepContent.notesPlaceholder')}
                minH="80px"
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
