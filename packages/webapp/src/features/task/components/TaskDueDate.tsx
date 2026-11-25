import useDateLocale from '@/common/hooks/useDateLocale'
import { HStack, StackProps, Text } from '@chakra-ui/react'
import { Task_Status_Enum } from '@gql'
import { formatRelative } from 'date-fns'
import React from 'react'
import { DueDateIcon } from 'src/icons'
import { isTaskOverdue } from '../utils/isTaskOverdue'

interface Props extends StackProps {
  dueDate: string
  status: Task_Status_Enum
}

export default function TaskDueDate({ dueDate, status, ...stackProps }: Props) {
  const dateLocale = useDateLocale()
  const date = new Date(dueDate)
  const isOverdue = isTaskOverdue({ dueDate, status })

  return (
    <HStack
      spacing={1}
      fontSize="xs"
      whiteSpace="nowrap"
      color={isOverdue ? 'red.500' : 'gray.500'}
      _dark={{ color: isOverdue ? 'red.300' : 'gray.400' }}
      {...stackProps}
    >
      <DueDateIcon size={12} />
      <Text as="span">
        {formatRelative(date, new Date(), { locale: dateLocale })}
      </Text>
    </HStack>
  )
}
