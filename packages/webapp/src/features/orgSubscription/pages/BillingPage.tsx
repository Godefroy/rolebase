import Loading from '@/common/atoms/Loading'
import { Title } from '@/common/atoms/Title'
import useCurrentMember from '@/member/hooks/useCurrentMember'
import useOrgOwner from '@/member/hooks/useOrgOwner'
import { Heading, Text, VStack } from '@chakra-ui/react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import BillingContent from '../components/BillingContent'
import SubscriptionProvider from '../contexts/SubscriptionProvider'

export default function BillingPage() {
  const { t } = useTranslation()
  const currentMember = useCurrentMember()
  const isOwner = useOrgOwner()

  return (
    <>
      <Title>{t('BillingPage.heading')}</Title>

      <VStack spacing={8} align="stretch">
        <Heading as="h1" size="lg">
          {t('BillingPage.heading')}
        </Heading>

        {!currentMember && <Loading center active />}

        {currentMember && !isOwner && (
          <Text as="b" color="red.500">
            {t('SubscriptionTabs.mustBeOwner')}
          </Text>
        )}

        {currentMember && isOwner && (
          <SubscriptionProvider>
            <BillingContent />
          </SubscriptionProvider>
        )}
      </VStack>
    </>
  )
}
