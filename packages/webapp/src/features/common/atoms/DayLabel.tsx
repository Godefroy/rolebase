import { BoxProps, Text } from '@chakra-ui/react'
import { format, isSameDay, isToday, isTomorrow } from 'date-fns'
import React from 'react'
import { useTranslation } from 'react-i18next'
import useDateLocale from '../hooks/useDateLocale'

interface Props extends BoxProps {
  date: string
  prevDate?: string
}

export default function DayLabel({
  date: dateStr,
  prevDate: prevDateStr,
  ...boxProps
}: Props) {
  const { t } = useTranslation()
  const dateLocale = useDateLocale()

  const date = new Date(dateStr)
  const prevDate = prevDateStr ? new Date(prevDateStr) : undefined
  const currentDate = new Date()
  const currentYear = currentDate.getFullYear()

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
      {isToday(date)
        ? t('common.dates.today')
        : isTomorrow(date)
          ? t('common.dates.tomorrow')
          : format(
              date,
              date.getFullYear() !== currentYear ? 'eeee P' : 'eeee dd/MM',
              { locale: dateLocale }
            )}
    </Text>
  )
}
