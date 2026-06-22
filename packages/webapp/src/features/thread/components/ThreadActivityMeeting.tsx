import MeetingItem from '@/meeting/components/MeetingItem'
import { Alert, AlertIcon, Text } from '@chakra-ui/react'
import { ThreadActivityMeetingFragment } from '@rolebase/shared/model/thread_activity'
import React from 'react'
import { useTranslation } from 'react-i18next'
import ThreadActivityLayout from './ThreadActivityLayout'

interface Props {
  activity: ThreadActivityMeetingFragment
}

export default function ThreadActivityMeeting({ activity }: Props) {
  const { t } = useTranslation()

  return (
    <ThreadActivityLayout activity={activity} allowDelete>
      <Text color="gray.500" _dark={{ color: 'gray.300' }}>
        {t(`ThreadActivityMeeting.text`)}
      </Text>
      {activity.refMeeting ? (
        <MeetingItem
          meeting={activity.refMeeting}
          showDate
          showIcon
          openButton
          maxW="2xl"
        />
      ) : (
        <Alert status="warning">
          <AlertIcon />
          {t('ThreadActivityMeeting.notAllowed')}
        </Alert>
      )}
    </ThreadActivityLayout>
  )
}
