import Loading from '@/common/atoms/Loading'
import { Title } from '@/common/atoms/Title'
import useCurrentMember from '@/member/hooks/useCurrentMember'
import useOrgOwner from '@/member/hooks/useOrgOwner'
import { stripePromise } from '@/orgSubscription/api/stripe'
import { Heading, Text, useDisclosure, VStack } from '@chakra-ui/react'
import { Elements } from '@stripe/react-stripe-js'
import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router'
import SubscriptionContent from '../components/SubscriptionContent'
import SubscriptionProvider from '../contexts/SubscriptionProvider'
import SubscriptionConfirmationModal from '../modals/SubscriptionConfirmationModal'

export default function SubscriptionPage() {
  const { t } = useTranslation()
  const currentMember = useCurrentMember()
  const isOwner = useOrgOwner()
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

        {!currentMember && <Loading center active />}

        {currentMember && !isOwner && (
          <Text as="b" color="red.500">
            {t('SubscriptionTabs.mustBeOwner')}
          </Text>
        )}

        {currentMember && isOwner && (
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
        )}
      </VStack>
    </>
  )
}
