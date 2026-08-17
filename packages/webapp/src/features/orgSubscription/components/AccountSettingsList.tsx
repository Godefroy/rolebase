import { StackProps, Text, VStack } from '@chakra-ui/react'
import { Subscription } from '@rolebase/shared/model/subscription'
import { capitalizeFirstLetter } from '@utils/capitalizeFirstLetter'
import { format } from 'date-fns'
import React from 'react'
import { useTranslation } from 'react-i18next'
import BillingDetailsSettingItem from './BillingDetailsSettingItem'
import BillingEmailSettingItem from './BillingEmailSettingItem'
import PaymentMethodSettingItem from './PaymentMethodSettingItem'
import SettingItem from './SettingItem'

type AccountSettingsListProps = {
  subscription: Subscription
  onUpdate: () => void
} & StackProps

export default function AccountSettingsList({
  subscription,
  onUpdate,
  ...stackProps
}: AccountSettingsListProps) {
  const { t } = useTranslation()

  return (
    <VStack mt="3" w="100%" spacing="0" {...stackProps}>
      <BillingEmailSettingItem
        email={subscription.billingDetails?.email ?? ''}
        onUpdate={onUpdate}
      />
      <BillingDetailsSettingItem
        billingDetails={subscription.billingDetails}
        onUpdate={onUpdate}
      />
      <PaymentMethodSettingItem card={subscription.card} onUpdate={onUpdate} />
      <SettingItem
        displayName={t('SubscriptionTabs.accountTab.currentSubscription')}
        value={
          subscription.expiresAt ? (
            <>
              <Text>
                {capitalizeFirstLetter(subscription.type.toLocaleLowerCase())}
              </Text>
              <Text color="red.500" as="i" fontSize={14}>
                {t('SubscriptionPlans.expiresAt')}{' '}
                {format(new Date(subscription.expiresAt), 'dd/MM/uuuu')}
              </Text>
            </>
          ) : (
            <>
              <Text>
                {capitalizeFirstLetter(subscription.type.toLocaleLowerCase())}
              </Text>
              <Text color="green.500" as="i" fontSize={14}>
                {t('SubscriptionPlans.active')}
              </Text>
            </>
          )
        }
      />
    </VStack>
  )
}
