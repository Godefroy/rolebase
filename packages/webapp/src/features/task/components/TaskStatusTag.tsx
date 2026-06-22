import { Tag, TagProps } from '@chakra-ui/react'
import { Task_Status_Enum } from '@gql'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { taskStatusColors } from 'src/theme'

interface Props extends TagProps {
  status: Task_Status_Enum
}

export default function TaskStatusTag({ status, ...tagProps }: Props) {
  const { t } = useTranslation()
  return (
    <Tag colorScheme={taskStatusColors[status]} fontSize="xs" {...tagProps}>
      {t(`common.taskStatus.${status}`)}
    </Tag>
  )
}
