import { Flex, FlexProps, Text } from '@chakra-ui/react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useSubscriptionContext } from '../contexts/SubscriptionContext'
import AccountSettingsList from './AccountSettingsList'

export default function AccountTab(flexProps: FlexProps) {
  const { t } = useTranslation()
  const { subscription, refetchSubscription } = useSubscriptionContext()

  return (
    <Flex w="100%" p="5" flexDir="row" justifyContent="center" {...flexProps}>
      {subscription && (
        <AccountSettingsList
          onUpdate={refetchSubscription}
          subscription={subscription}
        />
      )}
      {!subscription && (
        <Text pt="10" m="auto">
          {t('SubscriptionPlans.noBillingAccount')}
        </Text>
      )}
    </Flex>
  )
}
