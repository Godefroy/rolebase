import DayLabel from '@/common/atoms/DayLabel'
import { Box, BoxProps, HTMLChakraProps, Text } from '@chakra-ui/react'
import { MeetingSummaryFragment } from '@gql'
import { isSameDay, isToday } from 'date-fns'
import React from 'react'
import { useTranslation } from 'react-i18next'
import MeetingItem from './MeetingItem'

interface Props {
  meetings: MeetingSummaryFragment[]
  noModal?: boolean
  showCircle?: boolean
  highlightToday?: boolean
  itemProps?: HTMLChakraProps<any>
  dayLabelProps?: BoxProps
}

export default function MeetingsList({
  meetings,
  noModal,
  showCircle,
  highlightToday,
  itemProps,
  dayLabelProps,
}: Props) {
  const { t } = useTranslation()

  // Group consecutive meetings happening on the same day
  const days = meetings.reduce<MeetingSummaryFragment[][]>((acc, meeting) => {
    const lastDay = acc[acc.length - 1]
    if (
      lastDay &&
      isSameDay(new Date(lastDay[0].startDate), new Date(meeting.startDate))
    ) {
      lastDay.push(meeting)
    } else {
      acc.push([meeting])
    }
    return acc
  }, [])

  return (
    <>
      {meetings.length === 0 && (
        <Text fontStyle="italic">{t('MeetingsList.empty')}</Text>
      )}

      {days.map((day, i) => {
        const today = highlightToday && isToday(new Date(day[0].startDate))
        return (
          <Box
            key={day[0].id}
            position="relative"
            mt={i === 0 ? 0 : 4}
            {...(today && {
              _before: {
                content: '""',
                position: 'absolute',
                left: -2,
                top: 1,
                bottom: 1,
                width: '4px',
                borderRadius: 'full',
                bg: 'yellow.300',
              },
            })}
          >
            <DayLabel date={day[0].startDate} {...dayLabelProps} />
            {day.map((meeting) => (
              <MeetingItem
                key={meeting.id}
                meeting={meeting}
                noModal={noModal}
                showTime
                showCircle={showCircle}
                pl={2}
                {...itemProps}
              />
            ))}
          </Box>
        )
      })}
    </>
  )
}
