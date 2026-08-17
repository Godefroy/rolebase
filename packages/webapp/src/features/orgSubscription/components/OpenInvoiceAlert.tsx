import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
} from '@chakra-ui/react'
import { Invoice } from '@rolebase/shared/model/subscription'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { ExportIcon } from 'src/icons'

interface Props {
  invoice: Invoice
}

export default function OpenInvoiceAlert({ invoice }: Props) {
  const { t } = useTranslation()

  return (
    <Alert status="warning" borderRadius="md" alignItems="start">
      <AlertIcon />
      <Box flex="1">
        <AlertTitle>{t('SubscriptionTabs.openInvoice.title')}</AlertTitle>
        <AlertDescription display="block">
          {t('SubscriptionTabs.openInvoice.desc', {
            amount: (invoice.totalInCents / 100).toFixed(2),
          })}
        </AlertDescription>
      </Box>
      {invoice.hostedUrl && (
        <Button
          as="a"
          href={invoice.hostedUrl}
          target="_blank"
          rel="noopener noreferrer"
          colorScheme="orange"
          rightIcon={<ExportIcon size="1em" />}
          ml={3}
        >
          {t('SubscriptionTabs.openInvoice.pay')}
        </Button>
      )}
    </Alert>
  )
}
