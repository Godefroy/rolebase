import { Box, BoxProps, Heading, Text } from '@chakra-ui/react'
import { Invoice } from '@rolebase/shared/model/subscription'
import React from 'react'
import { useTranslation } from 'react-i18next'
import InvoiceTable from './InvoiceTable'

type InvoicesSectionProps = {
  invoices: Invoice[]
} & BoxProps

export default function InvoicesSection({
  invoices,
  ...boxProps
}: InvoicesSectionProps) {
  const { t } = useTranslation()

  return (
    <Box {...boxProps}>
      <Heading as="h2" size="md">
        {t('SubscriptionTabs.invoiceTab.heading')}
      </Heading>
      <Text mt="1" color="gray.500">
        {t('SubscriptionTabs.invoiceTab.desc')}
      </Text>

      {invoices.length > 0 ? (
        <Box mt="5">
          <InvoiceTable invoices={invoices} />
        </Box>
      ) : (
        <Text mt="5" as="i" color="gray.500">
          {t('SubscriptionTabs.invoiceTab.noInvoice')}
        </Text>
      )}
    </Box>
  )
}
