import { useOrgContext } from '@/org/contexts/OrgContext'
import { Box, Heading, VStack } from '@chakra-ui/react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import useOrgAccessRequests from '../hooks/useOrgAccessRequests'
import useOrgAdmin from '../hooks/useOrgAdmin'
import OrgAccessRequestItem from './OrgAccessRequestItem'

// Pending requests to join the org, for admins. Shown only when there are some.
export default function OrgAccessRequests() {
  const { t } = useTranslation()
  const isAdmin = useOrgAdmin()
  const orgId = useOrgContext().orgId
  const { requests, refresh } = useOrgAccessRequests(orgId, isAdmin)

  if (!isAdmin || requests.length === 0) return null

  return (
    <Box>
      <Heading as="h2" size="sm" mb={3}>
        {t('OrgAccessRequests.heading')}
      </Heading>
      <VStack spacing={2} align="stretch">
        {requests.map((request) => (
          <OrgAccessRequestItem
            key={request.id}
            request={request}
            onDecided={refresh}
          />
        ))}
      </VStack>
    </Box>
  )
}
