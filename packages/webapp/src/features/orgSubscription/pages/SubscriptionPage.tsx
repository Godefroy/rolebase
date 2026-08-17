import Loading from '@/common/atoms/Loading'
import ScrollableLayout from '@/common/atoms/ScrollableLayout'
import { Title } from '@/common/atoms/Title'
import useCurrentMember from '@/member/hooks/useCurrentMember'
import useOrgOwner from '@/member/hooks/useOrgOwner'
import { stripePromise } from '@/orgSubscription/api/stripe'
import { Box, Heading, Text, useDisclosure } from '@chakra-ui/react'
import { Elements } from '@stripe/react-stripe-js'
import React, { useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router'
import SubscriptionTabs from '../components/SubscriptionTabs'
import SubscriptionProvider from '../contexts/SubscriptionProvider'
import SubscriptionConfirmationModal from '../modals/SubscriptionConfirmationModal'

export default function SubscriptionPage() {
  const { t } = useTranslation()
  const currentMember = useCurrentMember()
  const isOwner = useOrgOwner()
  const isLoading = useMemo(() => !currentMember, [currentMember])
  const [searchParams] = useSearchParams()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const clientSecret = searchParams.get('payment_intent_client_secret')

  useEffect(() => {
    if (clientSecret) {
      onOpen()
    }
  }, [])

  return (
    <ScrollableLayout
      header={
        <Heading as="h1" size="lg" ml={5} my={2}>
          {t('SubscriptionPage.heading')}
        </Heading>
      }
    >
      <Title>{t('SubscriptionPage.heading')}</Title>

      <Box>
        {isOwner && !isLoading && (
          <SubscriptionProvider>
            <SubscriptionTabs w="100%" />
          </SubscriptionProvider>
        )}

        {!isOwner && !isLoading && (
          <Text px="10" as="b" color="red.500">
            {t('SubscriptionTabs.mustBeOwner')}
          </Text>
        )}

        {isLoading && <Loading center active />}

        {clientSecret && (
          <Elements stripe={stripePromise}>
            <SubscriptionConfirmationModal
              isOpen={isOpen}
              onClose={onClose}
              clientSecret={clientSecret}
            />
          </Elements>
        )}
      </Box>
    </ScrollableLayout>
  )
}
