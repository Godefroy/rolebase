import { useAuth } from '@/user/hooks/useAuth'
import { Button, Divider, Heading, Text, VStack } from '@chakra-ui/react'
import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { trackOnce } from 'src/analytics'
import { ColleagueOrg } from '../hooks/useColleagueOrgs'
import ColleagueOrgItem from './ColleagueOrgItem'

interface Props {
  orgs: ColleagueOrg[]
  onRequested(): Promise<unknown>
  onCreate(): void
}

// First onboarding step when colleagues already use Rolebase: request access
// to their org, or create a new one
export default function OnboardingJoinStep({
  orgs,
  onRequested,
  onCreate,
}: Props) {
  const { t } = useTranslation()
  const { user } = useAuth()
  const domain = user?.email?.split('@')[1] ?? ''
  const hasPendingRequest = orgs.some((org) => org.requestStatus === 'Pending')

  useEffect(() => {
    trackOnce('onboarding_join_viewed', { orgsCount: orgs.length })
    const handlePageHide = () =>
      trackOnce('onboarding_abandoned', { step: 'join' })
    window.addEventListener('pagehide', handlePageHide)
    return () => window.removeEventListener('pagehide', handlePageHide)
  }, [])

  return (
    <VStack spacing={5} align="stretch">
      <Heading as="h1" size="md">
        {t('Onboarding.join.heading')}
      </Heading>

      <Text>{t('Onboarding.join.description', { domain })}</Text>

      <VStack spacing={3} align="stretch">
        {orgs.map((org) => (
          <ColleagueOrgItem
            key={org.orgId}
            org={org}
            onRequested={onRequested}
          />
        ))}
      </VStack>

      {hasPendingRequest && (
        <Text fontSize="sm" color="gray.500">
          {t('Onboarding.join.pendingHelp')}
        </Text>
      )}

      <Divider />

      <VStack spacing={2} align="stretch">
        <Text fontSize="sm" color="gray.500">
          {t('Onboarding.join.createHelp')}
        </Text>
        <Button variant="outline" onClick={onCreate} alignSelf="flex-start">
          {t('Onboarding.join.create')}
        </Button>
      </VStack>
    </VStack>
  )
}
