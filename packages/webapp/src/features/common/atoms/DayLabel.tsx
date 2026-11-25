import { BoxProps, Text } from '@chakra-ui/react'
import { isSameDay } from 'date-fns'
import React from 'react'
import useFormatDay from '../hooks/useFormatDay'

interface Props extends BoxProps {
  date: string
  prevDate?: string
}

export default function DayLabel({
  date: dateStr,
  prevDate: prevDateStr,
  ...boxProps
}: Props) {
  const formatDay = useFormatDay()

  const date = new Date(dateStr)
  const prevDate = prevDateStr ? new Date(prevDateStr) : undefined

  // Show nothing if the date is the same as the previous one
  if (prevDate && isSameDay(date, prevDate)) {
    return null
  }

  return (
    <Text
      pl={2}
      textTransform="capitalize"
      color="gray.500"
      _dark={{ color: 'gray.400' }}
      {...boxProps}
    >
      {formatDay(date)}
    </Text>
  )
}
