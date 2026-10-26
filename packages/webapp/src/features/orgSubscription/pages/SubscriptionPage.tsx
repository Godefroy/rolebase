import { Title } from '@/common/atoms/Title'
import { stripePromise } from '@/orgSubscription/api/stripe'
import { Heading, useDisclosure, VStack } from '@chakra-ui/react'
import { Elements } from '@stripe/react-stripe-js'
import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router'
import SubscriptionContent from '../components/SubscriptionContent'
import SubscriptionProvider from '../contexts/SubscriptionProvider'
import SubscriptionConfirmationModal from '../modals/SubscriptionConfirmationModal'

export default function SubscriptionPage() {
  const { t } = useTranslation()
  const [searchParams] = useSearchParams()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const clientSecret = searchParams.get('payment_intent_client_secret')

  useEffect(() => {
    if (clientSecret) {
      onOpen()
    }
  }, [])

  return (
    <>
      <Title>{t('SubscriptionPage.heading')}</Title>

      <VStack spacing={8} align="stretch">
        <Heading as="h1" size="lg">
          {t('SubscriptionPage.heading')}
        </Heading>

        <SubscriptionProvider>
          <SubscriptionContent />

          {clientSecret && (
            <Elements stripe={stripePromise}>
              <SubscriptionConfirmationModal
                isOpen={isOpen}
                onClose={onClose}
                clientSecret={clientSecret}
              />
            </Elements>
          )}
        </SubscriptionProvider>
      </VStack>
    </>
  )
}
