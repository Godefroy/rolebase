import Loading from '@/common/atoms/Loading'
import ModalCloseStaticButton from '@/common/atoms/ModalCloseStaticButton'
import TextErrors from '@/common/atoms/TextErrors'
import { Title } from '@/common/atoms/Title'
import { useOrgContext } from '@/org/contexts/OrgContext'
import { Box, Flex, Heading, Spacer } from '@chakra-ui/react'
import { useLastLogsQuery } from '@gql'
import React, { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import LogsList from './LogsList'

const limit = 50

interface Props {
  changeTitle?: boolean
  // When true, the content flows to its natural height instead of filling its
  // parent with an inner scroll. Used when the whole page scrolls (mobile/tablet).
  flowHeight?: boolean
  // Override the header close button handler (otherwise closes the parent modal)
  onClose?: () => void
}

export default function LogsContent({
  changeTitle,
  flowHeight,
  onClose,
}: Props) {
  const { t } = useTranslation()
  const { orgId } = useOrgContext()
  const scrollRef = useRef<HTMLDivElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  // Subscribe to logs
  const { data, error, loading, fetchMore, refetch } = useLastLogsQuery({
    skip: !orgId,
    variables: { orgId: orgId!, limit },
    fetchPolicy: 'cache-and-network',
    initialFetchPolicy: 'network-only',
    notifyOnNetworkStatusChange: true,
  })
  const logs = data?.log
  const count = data?.log_aggregate.aggregate?.count

  // Load more logs when the bottom of the list is reached
  useEffect(() => {
    if (!bottomRef.current || !logs || logs.length === count || loading) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        fetchMore({
          variables: {
            offset: logs.length,
          },
          // Update cache with new logs
          updateQuery: (previousResult, { fetchMoreResult }) => {
            if (!fetchMoreResult) {
              return previousResult
            }
            return {
              ...fetchMoreResult,
              log: [...previousResult.log, ...fetchMoreResult.log],
            }
          },
        })
      },
      {
        // The panel scrolls on its own on desktop, the page scrolls on mobile
        root: flowHeight ? null : scrollRef.current,
        rootMargin: '0px',
        threshold: 1.0,
      }
    )

    observer.observe(bottomRef.current)

    return () => observer.disconnect()
  }, [logs, loading, flowHeight])

  return (
    <Flex direction="column" h={flowHeight ? undefined : '100%'}>
      {changeTitle && <Title>{t('LogsContent.heading')}</Title>}

      <Flex
        alignItems="center"
        pl={6}
        pr={2}
        py={3}
        bg="menulight"
        _dark={{ bg: 'menudark' }}
      >
        <Heading as="h1" size="md" fontWeight="bold">
          {t('LogsContent.heading')}
        </Heading>
        <Spacer />
        <ModalCloseStaticButton onClose={onClose} />
      </Flex>

      <Box
        ref={scrollRef}
        flex={flowHeight ? undefined : 1}
        minH={flowHeight ? undefined : 0}
        overflowY={flowHeight ? undefined : 'auto'}
        px={3}
        py={5}
      >
        {logs && (
          <LogsList logs={logs} groupByDay onCancelled={() => refetch()} />
        )}

        <Box ref={bottomRef} mt={3} textAlign="center">
          {loading && <Loading active />}
        </Box>

        <TextErrors errors={[error]} />
      </Box>
    </Flex>
  )
}
