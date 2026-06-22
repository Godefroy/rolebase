import { Alert, AlertIcon, Text } from '@chakra-ui/react'
import { ThreadActivityThreadFragment } from '@rolebase/shared/model/thread_activity'
import React from 'react'
import { useTranslation } from 'react-i18next'
import ThreadActivityLayout from './ThreadActivityLayout'
import ThreadItem from './ThreadItem'

interface Props {
  activity: ThreadActivityThreadFragment
}

export default function ThreadActivityThread({ activity }: Props) {
  const { t } = useTranslation()

  return (
    <ThreadActivityLayout activity={activity} allowDelete>
      <Text color="gray.500" _dark={{ color: 'gray.300' }}>
        {t(`ThreadActivityThread.text`)}
      </Text>
      {activity.refThread ? (
        <ThreadItem
          thread={activity.refThread}
          showIcon
          openButton
          maxW="2xl"
        />
      ) : (
        <Alert status="warning">
          <AlertIcon />
          {t('ThreadActivityThread.notAllowed')}
        </Alert>
      )}
    </ThreadActivityLayout>
  )
}
