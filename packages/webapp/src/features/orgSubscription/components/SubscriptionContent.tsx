import { HStack, Spinner, VStack } from '@chakra-ui/react'
import React from 'react'
import { useSubscriptionContext } from '../contexts/SubscriptionContext'
import OpenInvoiceAlert from './OpenInvoiceAlert'
import SubscriptionPlansFreeLayout from './SubscriptionPlansFreeLayout'
import SubscriptionPlansSubLayout from './SubscriptionPlansSubLayout'

export default function SubscriptionContent() {
  const { subscription, openInvoice, loading } = useSubscriptionContext()

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
