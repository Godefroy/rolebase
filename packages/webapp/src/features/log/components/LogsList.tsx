import DayLabel from '@/common/atoms/DayLabel'
import { Box, BoxProps, Text, useDisclosure } from '@chakra-ui/react'
import { LogFragment } from '@gql'
import { isSameDay } from 'date-fns'
import React, { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import useCanCancelLog from '../hooks/useCanCancelLog'
import LogCancelModal from '../modals/LogCancelModal'
import LogItem from './LogItem'

interface Props extends BoxProps {
  logs: LogFragment[]
  // Group consecutive entries under a day label, and show only the time on
  // each entry. For long lists (history panel).
  groupByDay?: boolean
  // Called after a log is cancelled, so query-backed lists can refetch
  // (subscription-backed lists update on their own and can omit it).
  onCancelled?(): void
}

export default function LogsList({
  logs,
  groupByDay,
  onCancelled,
  ...boxProps
}: Props) {
  const { t } = useTranslation()
  const canCancelLog = useCanCancelLog()

  // Log modal
  const [cancelLog, setCancelLog] = useState<LogFragment | undefined>()
  const {
    isOpen: isCancelOpen,
    onOpen: onCancelOpen,
    onClose: onCancelClose,
  } = useDisclosure()

  const handleOpenCancel = useCallback((log: LogFragment) => {
    setCancelLog(log)
    onCancelOpen()
  }, [])

  // Group consecutive logs happening on the same day
  const days = useMemo(
    () =>
      logs.reduce<LogFragment[][]>((acc, log) => {
        const lastDay = acc[acc.length - 1]
        if (
          lastDay &&
          isSameDay(new Date(lastDay[0].createdAt), new Date(log.createdAt))
        ) {
          lastDay.push(log)
        } else {
          acc.push([log])
        }
        return acc
      }, []),
    [logs]
  )

  const renderItem = (log: LogFragment) => (
    <LogItem
      key={log.id}
      log={log}
      timeOnly={groupByDay}
      onCancel={canCancelLog(log) ? () => handleOpenCancel(log) : undefined}
    />
  )

  return (
    <Box {...boxProps}>
      {logs.length === 0 && (
        <Text fontStyle="italic">{t('LogsList.empty')}</Text>
      )}

      {groupByDay
        ? days.map((day, i) => (
            <Box key={day[0].id} mt={i === 0 ? 0 : 6}>
              <DayLabel
                date={day[0].createdAt}
                fontSize="sm"
                fontWeight="semibold"
                pl={3}
                mb={1}
              />
              {day.map(renderItem)}
            </Box>
          ))
        : logs.map(renderItem)}

      {isCancelOpen && cancelLog && (
        <LogCancelModal
          log={cancelLog}
          isOpen
          onClose={onCancelClose}
          onCancelled={onCancelled}
        />
      )}
    </Box>
  )
}
