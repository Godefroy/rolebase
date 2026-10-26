import { Title } from '@/common/atoms/Title'
import { Heading, VStack } from '@chakra-ui/react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import BillingContent from '../components/BillingContent'
import SubscriptionProvider from '../contexts/SubscriptionProvider'

export default function BillingPage() {
  const { t } = useTranslation()

  return (
    <>
      <Title>{t('BillingPage.heading')}</Title>

      <VStack spacing={8} align="stretch">
        <Heading as="h1" size="lg">
          {t('BillingPage.heading')}
        </Heading>

        <SubscriptionProvider>
          <BillingContent />
        </SubscriptionProvider>
      </VStack>
    </>
  )
}
