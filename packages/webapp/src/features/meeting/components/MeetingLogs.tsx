import Loading from '@/common/atoms/Loading'
import TextErrors from '@/common/atoms/TextErrors'
import { useOrgContext } from '@/org/contexts/OrgContext'
import {
  Box,
  BoxProps,
  Button,
  Collapse,
  Heading,
  useDisclosure,
} from '@chakra-ui/react'
import { useMeetingLogsSubscription } from '@gql'
import { LogType } from '@rolebase/shared/model/log'
import React, { useMemo } from 'react'
import { ChevronDownIcon, ChevronUpIcon } from 'src/icons'
import LogsList from '../../log/components/LogsList'

interface Props extends BoxProps {
  meetingId: string
  title: string
  includeTypes?: LogType[]
  excludeTypes?: LogType[]
  hideEmpty?: boolean
}

export default function MeetingLogs({
  meetingId,
  title,
  includeTypes,
  excludeTypes,
  hideEmpty,
  ...boxProps
}: Props) {
  const { orgId } = useOrgContext()
  const showLogs = useDisclosure()

  // Subscribe to logs
  const { data, error, loading } = useMeetingLogsSubscription({
    skip: !orgId,
    variables: { meetingId },
  })

  const logs = useMemo(
    () =>
      data?.log.filter((log) => {
        if (includeTypes && !includeTypes.includes(log.display.type)) {
          return false
        }
        if (excludeTypes && excludeTypes.includes(log.display.type)) {
          return false
        }
        return true
      }),
    [data, includeTypes, excludeTypes]
  )

  if (hideEmpty && logs?.length === 0) return null

  return (
    <Box {...boxProps}>
      {loading && <Loading active size="md" />}
      <TextErrors errors={[error]} />

      {logs && (
        <>
          <Button
            variant="link"
            leftIcon={
              showLogs.isOpen ? (
                <ChevronUpIcon size="1em" />
              ) : (
                <ChevronDownIcon size="1em" />
              )
            }
            onClick={showLogs.onToggle}
          >
            {showLogs.isOpen ? (
              <Heading as="h2" size="md" mb={2}>
                {title}
              </Heading>
            ) : (
              title
            )}
          </Button>
          <Collapse in={showLogs.isOpen} animateOpacity>
            <LogsList logs={logs} />
          </Collapse>
        </>
      )}
    </Box>
  )
}
