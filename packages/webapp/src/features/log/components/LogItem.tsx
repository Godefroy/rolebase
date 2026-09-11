import IconTextButton from '@/common/atoms/IconTextButton'
import useDateLocale from '@/common/hooks/useDateLocale'
import { Box, Flex, Text } from '@chakra-ui/react'
import { LogFragment } from '@gql'
import { capitalizeFirstLetter } from '@utils/capitalizeFirstLetter'
import { format } from 'date-fns'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { LogIcon } from 'src/icons'
import LogAvatar from './LogAvatar'
import LogCancelText from './LogCancelText'
import LogText from './LogText'

interface Props {
  log: LogFragment
  // When the list already groups entries by day, only the time is shown
  timeOnly?: boolean
  onCancel?(): void
}

export default function LogItem({ log, timeOnly, onCancel }: Props) {
  const { t } = useTranslation()
  const dateLocale = useDateLocale()

  // A cancellation entry (cancelLogId set) can't itself be cancelled.
  const canCancel = onCancel && !log.canceled && !log.cancelLogId

  return (
    <Flex
      role="group"
      gap={3}
      py={2}
      px={3}
      borderRadius="md"
      _hover={{ bg: 'gray.100', _dark: { bg: 'whiteAlpha.100' } }}
    >
      <LogAvatar
        id={log.cancelMemberId || log.memberId}
        name={log.cancelMemberName || log.memberName}
        size="sm"
        mt={0.5}
      />

      <Box flex={1} minW={0}>
        <Text textDecoration={log.canceled ? 'line-through' : undefined}>
          <LogCancelText log={log} />
          <LogText log={log} />
        </Text>
        <Text fontSize="sm" color="gray.500" _dark={{ color: 'gray.400' }}>
          {capitalizeFirstLetter(
            format(new Date(log.createdAt), timeOnly ? 'p' : 'PPpp', {
              locale: dateLocale,
            })
          )}
        </Text>
      </Box>

      {canCancel && (
        <IconTextButton
          aria-label={t('LogItem.open')}
          size="sm"
          variant="ghost"
          icon={<LogIcon size={20} />}
          opacity={{ base: 1, lg: 0 }}
          _groupHover={{ opacity: 1 }}
          _focusVisible={{ opacity: 1 }}
          onClick={onCancel}
        />
      )}
    </Flex>
  )
}
