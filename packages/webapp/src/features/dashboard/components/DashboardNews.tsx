import Loading from '@/common/atoms/Loading'
import TextErrors from '@/common/atoms/TextErrors'
import DashboardHomeNote from '@/dashboard/components/DashboardHomeNote'
import NewsList from '@/news/components/NewsList'
import useCurrentOrg from '@/org/hooks/useCurrentOrg'
import CircleSearchButton from '@/search/components/CircleSearchButton'
import CircleSearchInput from '@/search/components/CircleSearchInput'
import {
  Alert,
  AlertDescription,
  AlertIcon,
  Box,
  BoxProps,
  ButtonGroup,
  Card,
  CardBody,
  CardHeader,
  Heading,
  Stack,
} from '@chakra-ui/react'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ChevronDownIcon } from 'src/icons'
import { useNewsFeed } from '../../news/hooks/useNewsFeed'

export default function DashboardNews(boxProps: BoxProps) {
  const { t } = useTranslation()
  const org = useCurrentOrg()
  const [circleId, setCircleId] = useState<string | undefined>()

  // Subscribe to news
  const { news, error, loading, bottomRef } = useNewsFeed(circleId)

  return (
    <Stack spacing={0} {...boxProps}>
      <DashboardHomeNote mb={4} />

      <Card boxShadow="none">
        <CardHeader
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Heading as="h2" size="md">
            {t('DashboardNews.heading')}
          </Heading>

          <ButtonGroup size="sm" variant="outline" spacing={2}>
            {circleId ? (
              <CircleSearchInput
                value={circleId}
                placeholder={t('DashboardNews.circle')}
                maxW="170px"
                onChange={setCircleId}
                onClear={() => setCircleId(undefined)}
              />
            ) : (
              <CircleSearchButton
                rightIcon={<ChevronDownIcon size="1em" />}
                fontWeight="normal"
                onSelect={setCircleId}
              >
                {t('DashboardNews.circle')}
              </CircleSearchButton>
            )}
          </ButtonGroup>
        </CardHeader>

        {error && (
          <CardBody p={4} pt={0}>
            <TextErrors errors={[error]} />
          </CardBody>
        )}
      </Card>

      {news?.length === 0 && (
        <Alert status="info" mt={10}>
          <AlertIcon />
          <AlertDescription>
            {t('DashboardNews.empty', { org: org?.name })}
          </AlertDescription>
        </Alert>
      )}

      {news && <NewsList items={news} showSeparatorTop />}

      <Box ref={bottomRef} textAlign="center">
        {loading && <Loading active size="sm" mt={10} />}
      </Box>
    </Stack>
  )
}
