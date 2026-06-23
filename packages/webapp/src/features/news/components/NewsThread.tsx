import { ExpandableText } from '@/common/atoms/ExpandableText'
import Markdown from '@/common/atoms/Markdown'
import ThreadItem from '@/thread/components/ThreadItem'
import { LinkBoxProps } from '@chakra-ui/react'
import { ThreadWithFirstActivityFragment } from '@gql'
import React from 'react'
import NewsItemLayout from './NewsItemLayout'

interface Props extends LinkBoxProps {
  thread: ThreadWithFirstActivityFragment
}

export default function NewsThread({ thread }: Props) {
  const firstMessage = thread?.activities[0]?.data?.message

  return (
    <NewsItemLayout
      i18nKey="DashboardNewsThread.action"
      date={thread.createdAt}
      memberId={thread.initiatorMemberId}
      circleId={thread.circleId}
    >
      <ThreadItem
        thread={thread}
        openButton
        showIcon
        fontWeight="medium"
        my={3}
      />

      {firstMessage && (
        <ExpandableText p={2} pt={0} noOfLines={4}>
          <Markdown>{firstMessage}</Markdown>
        </ExpandableText>
      )}
    </NewsItemLayout>
  )
}
