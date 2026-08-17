import { Flex, FlexProps } from '@chakra-ui/react'
import React from 'react'
import { useSubscriptionContext } from '../contexts/SubscriptionContext'
import InvoiceTabLayout from './InvoiceTabLayout'

export default function InvoiceTab(flexProps: FlexProps) {
  const { invoices } = useSubscriptionContext()

  return (
    <Flex p="5" flexDir="row" {...flexProps}>
      <InvoiceTabLayout invoices={invoices} />
    </Flex>
  )
}
