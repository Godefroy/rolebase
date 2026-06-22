import useOrgMember from '@/member/hooks/useOrgMember'
import { Box, BoxProps, Text, useDisclosure } from '@chakra-ui/react'
import { LogFragment } from '@gql'
import React, { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import LogCancelModal from '../modals/LogCancelModal'
import LogItem from './LogItem'

interface Props extends BoxProps {
  logs: LogFragment[]
  // Called after a log is cancelled, so query-backed lists can refetch
  // (subscription-backed lists update on their own and can omit it).
  onCancelled?(): void
}

export default function LogsList({ logs, onCancelled, ...boxProps }: Props) {
  const { t } = useTranslation()
  const isMember = useOrgMember()

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

  return (
    <Box {...boxProps}>
      {logs.length === 0 && (
        <Text fontStyle="italic">{t('LogsList.empty')}</Text>
      )}

      {logs.map((log) => (
        <LogItem
          key={log.id}
          log={log}
          onCancel={isMember ? () => handleOpenCancel(log) : undefined}
        />
      ))}

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
