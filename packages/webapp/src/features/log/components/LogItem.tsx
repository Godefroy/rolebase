import IconTextButton from '@/common/atoms/IconTextButton'
import useDateLocale from '@/common/hooks/useDateLocale'
import { Box, Flex, Spacer, Text, useColorMode } from '@chakra-ui/react'
import { LogFragment } from '@gql'
import { capitalizeFirstLetter } from '@utils/capitalizeFirstLetter'
import { format } from 'date-fns'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { LogIcon } from 'src/icons'
import LogCancelText from './LogCancelText'
import LogText from './LogText'

interface Props {
  log: LogFragment
  onCancel?(): void
}

export default function LogItem({ log, onCancel }: Props) {
  const { t } = useTranslation()
  const { colorMode } = useColorMode()
  const dateLocale = useDateLocale()

  return (
    <Flex
      py={3}
      borderBottom="1px solid"
      borderBottomColor={colorMode === 'light' ? 'gray.200' : 'gray.550'}
    >
      <Box>
        <Text textDecoration={log.canceled ? 'line-through' : undefined}>
          <LogCancelText log={log} />
          <LogText log={log} />
        </Text>
        <Text fontSize="sm" color="gray.500" _dark={{ color: 'gray.400' }}>
          {capitalizeFirstLetter(
            format(new Date(log.createdAt), 'PPpp', {
              locale: dateLocale,
            })
          )}
        </Text>
      </Box>

      <Spacer />

      {/* A cancellation entry (cancelLogId set) can't itself be cancelled. */}
      {onCancel && !log.canceled && !log.cancelLogId && (
        <IconTextButton
          aria-label={t('LogItem.open')}
          size="sm"
          variant="ghost"
          icon={<LogIcon size={20} />}
          onClick={onCancel}
        />
      )}
    </Flex>
  )
}
