import { HStack, StackProps, Text, useDisclosure } from '@chakra-ui/react'
import { SubscriptionCard } from '@rolebase/shared/model/subscription'
import React from 'react'
import { useTranslation } from 'react-i18next'
import UpdatePaymentMethodModal from '../modals/UpdatePaymentMethodModal'
import CreditCardIcon from './CreditCardIcon'
import SettingItem from './SettingItem'

type PaymentMethodSettingItemProps = {
  card: SubscriptionCard | null
  onUpdate: () => void
} & StackProps

export default function PaymentMethodSettingItem({
  card,
  onUpdate,
  ...stackProps
}: PaymentMethodSettingItemProps) {
  const { t } = useTranslation()
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <>
      <SettingItem
        displayName={t('SubscriptionTabs.accountTab.paymentMethod')}
        onEdit={onOpen}
        value={
          card ? (
            <HStack>
              <CreditCardIcon name={card.brand} size={30} />
              <Text>···· {card.last4}</Text>
              <Text color="gray.500">
                {t('SubscriptionPlans.expiresAt')}{' '}
                {card.expMonth.toString().padStart(2, '0')}/{card.expYear}
              </Text>
            </HStack>
          ) : null
        }
        editable
        {...stackProps}
      />
      {isOpen && (
        <UpdatePaymentMethodModal
          size="lg"
          isOpen={isOpen}
          onClose={onClose}
          onUpdate={onUpdate}
        />
      )}
    </>
  )
}
