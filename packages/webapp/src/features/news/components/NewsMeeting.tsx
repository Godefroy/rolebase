import { ExpandableText } from '@/common/atoms/ExpandableText'
import Markdown from '@/common/atoms/Markdown'
import MeetingItem from '@/meeting/components/MeetingItem'
import { LinkBoxProps } from '@chakra-ui/react'
import { MeetingSummaryFragment } from '@gql'
import React from 'react'
import { MeetingAvatarIcon } from 'src/icons'
import NewsItemLayout from './NewsItemLayout'

interface Props extends LinkBoxProps {
  meeting: MeetingSummaryFragment
}

export default function NewsMeeting({ meeting }: Props) {
  return (
    <NewsItemLayout
      i18nKey="DashboardNewsMeeting.action"
      date={meeting.endDate}
      icon={MeetingAvatarIcon}
      circleId={meeting.circleId}
    >
      <MeetingItem
        meeting={meeting}
        openButton
        showIcon
        fontWeight="medium"
        my={3}
      />

      {meeting.summary && (
        <ExpandableText p={2} pt={0} noOfLines={4}>
          <Markdown>{meeting.summary}</Markdown>
        </ExpandableText>
      )}
    </NewsItemLayout>
  )
}
