import { Flex, FlexProps } from '@chakra-ui/react'
import React from 'react'
import { useSubscriptionContext } from '../contexts/SubscriptionContext'
import OpenInvoiceAlert from './OpenInvoiceAlert'
import SubscriptionTabFreeLayout from './SubscriptionTabFreeLayout'
import SubscriptionTabSubLayout from './SubscriptionTabSubLayout'

export default function SubscriptionTab(flexProps: FlexProps) {
  const { subscription, openInvoice } = useSubscriptionContext()

  return (
    <Flex p="5" flexDir="column" gap="5" {...flexProps}>
      {openInvoice && <OpenInvoiceAlert invoice={openInvoice} />}

      {subscription ? (
        <SubscriptionTabSubLayout />
      ) : (
        <SubscriptionTabFreeLayout />
      )}
    </Flex>
  )
}
