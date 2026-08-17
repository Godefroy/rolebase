import { Box, Heading, HStack, Spinner, Text, VStack } from '@chakra-ui/react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useSubscriptionContext } from '../contexts/SubscriptionContext'
import AccountSettingsList from './AccountSettingsList'
import InvoicesSection from './InvoicesSection'
import OpenInvoiceAlert from './OpenInvoiceAlert'
import SubscriptionUpcomingInvoiceCard from './SubscriptionUpcomingInvoiceCard'

export default function BillingContent() {
  const { t } = useTranslation()
  const { subscription, invoices, openInvoice, loading, refetchSubscription } =
    useSubscriptionContext()

  if (loading) {
    return (
      <HStack w="100%" justifyContent="center" pt="12">
        <Spinner size="xl" />
      </HStack>
    )
  }

  return (
    <VStack align="stretch" spacing="10">
      {openInvoice && <OpenInvoiceAlert invoice={openInvoice} />}

      {subscription?.upcomingInvoice && (
        <SubscriptionUpcomingInvoiceCard
          maxW="430px"
          upcomingInvoice={subscription.upcomingInvoice}
        />
      )}

      {subscription ? (
        <Box>
          <Heading as="h2" size="md">
            {t('BillingPage.billingInfo')}
          </Heading>
          <AccountSettingsList
            subscription={subscription}
            onUpdate={refetchSubscription}
          />
        </Box>
      ) : (
        <Text>{t('SubscriptionPlans.noBillingAccount')}</Text>
      )}

      <InvoicesSection invoices={invoices} />
    </VStack>
  )
}
