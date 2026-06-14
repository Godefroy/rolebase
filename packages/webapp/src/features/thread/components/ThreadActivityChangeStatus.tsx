import LogText from '@/log/components/LogText'
import { Text } from '@chakra-ui/react'
import { ThreadActivityChangeStatusFragment } from '@rolebase/shared/model/thread_activity'
import React from 'react'
import ThreadActivityLayout from './ThreadActivityLayout'

export type Props = {
  activity: ThreadActivityChangeStatusFragment
}

export const ThreadActivityChangeStatus = ({ activity }: Props) => {
  return (
    <ThreadActivityLayout activity={activity}>
      <Text color="gray.500" _dark={{ color: 'gray.300' }}>
        <LogText log={activity.data} />
      </Text>
    </ThreadActivityLayout>
  )
}
