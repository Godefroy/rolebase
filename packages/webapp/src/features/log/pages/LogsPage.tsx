import Loading from '@/common/atoms/Loading'
import ScrollableLayout from '@/common/atoms/ScrollableLayout'
import TextErrors from '@/common/atoms/TextErrors'
import { Title } from '@/common/atoms/Title'
import { useOrgContext } from '@/org/contexts/OrgContext'
import { Box, Flex, Heading } from '@chakra-ui/react'
import { useLastLogsQuery } from '@gql'
import React, { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import LogsList from '../components/LogsList'

const limit = 50

export default function LogsPage() {
  const { t } = useTranslation()
  const { orgId } = useOrgContext()
  const bottomRef = useRef(null)

  // Subscribe to logs
  const { data, error, loading, fetchMore } = useLastLogsQuery({
    skip: !orgId,
    variables: { orgId: orgId!, limit },
    fetchPolicy: 'cache-and-network',
    initialFetchPolicy: 'network-only',
    notifyOnNetworkStatusChange: true,
  })
  const logs = data?.log
  const count = data?.log_aggregate.aggregate?.count

  // Load more logs when user reaches bottom of page
  useEffect(() => {
    if (!bottomRef.current || !logs || logs.length === count || loading) return

    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 1.0,
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
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
      }
    }, options)

    observer.observe(bottomRef.current)

    return () => {
      if (!bottomRef.current) return
      observer.unobserve(bottomRef.current)
    }
  }, [logs, loading])

  return (
    <ScrollableLayout
      header={
        <Flex ml={5} my={2} w="100%" alignItems="center" flexWrap="wrap">
          <Heading as="h1" size="lg">
            {t('LogsPage.heading')}
          </Heading>
        </Flex>
      }
    >
      <Title>{t('LogsPage.heading')}</Title>

      <Box maxW="3xl" p={{ base: 5, sm: 10 }}>
        {logs && <LogsList logs={logs} />}

        <Box ref={bottomRef} mt={3} textAlign="center">
          {loading && <Loading active />}
        </Box>

        <TextErrors errors={[error]} />
      </Box>
    </ScrollableLayout>
  )
}
