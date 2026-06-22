import { Alert, AlertIcon, Text } from '@chakra-ui/react'
import { ThreadActivityTaskFragment } from '@rolebase/shared/model/thread_activity'
import React from 'react'
import { useTranslation } from 'react-i18next'
import TaskItem from '../../task/components/TaskItem'
import ThreadActivityLayout from './ThreadActivityLayout'

interface Props {
  activity: ThreadActivityTaskFragment
}

export default function ThreadActivityTask({ activity }: Props) {
  const { t } = useTranslation()

  return (
    <ThreadActivityLayout activity={activity} allowDelete>
      <Text color="gray.500" _dark={{ color: 'gray.300' }}>
        {t(`ThreadActivityTask.text`)}
      </Text>
      {activity.refTask ? (
        <TaskItem
          task={activity.refTask}
          showMember
          showIcon
          showDueDate
          openButton
          maxW="2xl"
        />
      ) : (
        <Alert status="warning">
          <AlertIcon />
          {t('ThreadActivityTask.notAllowed')}
        </Alert>
      )}
    </ThreadActivityLayout>
  )
}
