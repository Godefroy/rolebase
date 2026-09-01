import { HStack, Spinner, VStack } from '@chakra-ui/react'
import React, { useEffect } from 'react'
import { track } from 'src/analytics'
import { useSubscriptionContext } from '../contexts/SubscriptionContext'
import OpenInvoiceAlert from './OpenInvoiceAlert'
import SubscriptionPlansFreeLayout from './SubscriptionPlansFreeLayout'
import SubscriptionPlansSubLayout from './SubscriptionPlansSubLayout'

export default function SubscriptionContent() {
  const { subscription, openInvoice, loading } = useSubscriptionContext()

  // Entry point of the monetization funnel, sent once the plans are readable.
  useEffect(() => {
    if (loading) return
    track('subscription_viewed', {
      currentPlan: subscription?.type ?? 'free',
      hasOpenInvoice: !!openInvoice,
    })
  }, [loading])

  if (loading) {
    return (
      <HStack w="100%" justifyContent="center" pt="12">
        <Spinner size="xl" />
      </HStack>
    )
  }

  return (
    <VStack align="stretch" spacing="5">
      {openInvoice && <OpenInvoiceAlert invoice={openInvoice} />}

      {subscription ? (
        <SubscriptionPlansSubLayout />
      ) : (
        <SubscriptionPlansFreeLayout />
      )}
    </VStack>
  )
}
