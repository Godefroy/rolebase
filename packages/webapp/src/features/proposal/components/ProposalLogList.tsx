import {
  Alert,
  AlertIcon,
  Box,
  Flex,
  IconButton,
  Spacer,
  Tooltip,
  useDisclosure,
  VStack,
} from '@chakra-ui/react'
import { LogType } from '@rolebase/shared/model/log'
import { ProposalLog } from '@rolebase/shared/model/proposal'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FiX } from 'react-icons/fi'
import { ShowIcon } from 'src/icons'
import ProposalLogDiffModal from '../modals/ProposalLogDiffModal'
import ProposalLogItem from './ProposalLogItem'

interface Props {
  logs: ProposalLog[]
  onRemove?(logId: string): void
  // Read-only when previewed outside the org chart editor
  readOnly?: boolean
}

export default function ProposalLogList({ logs, onRemove, readOnly }: Props) {
  const { t } = useTranslation()
  const diffModal = useDisclosure()
  const [diffLog, setDiffLog] = useState<ProposalLog>()

  const openDiff = (log: ProposalLog) => {
    setDiffLog(log)
    diffModal.onOpen()
  }

  if (logs.length === 0) {
    return (
      <Box color="gray.500" _dark={{ color: 'gray.300' }} fontSize="sm">
        {t('ProposalLogList.empty')}
      </Box>
    )
  }

  return (
    <VStack align="stretch" spacing={1}>
      {logs.map((log) => (
        <Flex
          key={log.id}
          align="center"
          fontSize="sm"
          px={2}
          py={1}
          borderRadius="md"
          bg={log.error ? 'red.50' : undefined}
          _dark={{ bg: log.error ? 'red.900' : undefined }}
        >
          {log.error && (
            <Tooltip label={t('ProposalLogList.error')} hasArrow>
              <Box mr={2} display="inline-flex">
                <Alert
                  status="error"
                  variant="subtle"
                  p={0}
                  bg="transparent"
                  w="auto"
                >
                  <AlertIcon m={0} />
                </Alert>
              </Box>
            </Tooltip>
          )}
          <Box>
            <ProposalLogItem log={log} readOnly={readOnly} />
          </Box>
          <Spacer />
          {log.display.type === LogType.RoleUpdate && (
            <Tooltip label={t('ProposalLogList.viewDiff')} hasArrow>
              <IconButton
                aria-label={t('ProposalLogList.viewDiff')}
                icon={<ShowIcon size={16} />}
                variant="ghost"
                size="xs"
                onClick={() => openDiff(log)}
              />
            </Tooltip>
          )}
          {onRemove && (
            <IconButton
              aria-label={t('common.remove')}
              icon={<FiX />}
              variant="ghost"
              size="xs"
              onClick={() => onRemove(log.id)}
            />
          )}
        </Flex>
      ))}

      {diffModal.isOpen && diffLog && (
        <ProposalLogDiffModal
          log={diffLog}
          isOpen
          onClose={diffModal.onClose}
        />
      )}
    </VStack>
  )
}
