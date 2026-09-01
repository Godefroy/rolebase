import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  ModalProps,
} from '@chakra-ui/react'
import { Subscription_Plan_Type_Enum } from '@gql'
import { capitalizeFirstLetter } from '@utils/capitalizeFirstLetter'
import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { track } from 'src/analytics'
import SubscriptionPaymentStepper from '../components/SubscriptionPaymentStepper'

type SubscriptionPaymentModalProps = {
  planType: Subscription_Plan_Type_Enum
} & Omit<ModalProps, 'children'>

export default function SubscriptionPaymentModal({
  planType,
  ...modalProps
}: SubscriptionPaymentModalProps) {
  const { t } = useTranslation()

  useEffect(() => {
    if (modalProps.isOpen) track('subscription_plan_selected', { plan: planType })
  }, [modalProps.isOpen, planType])

  return (
    <Modal size="xl" closeOnOverlayClick={false} {...modalProps}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {t('SubscriptionTabs.paymentModal.subscribeToPlan', {
            plan: capitalizeFirstLetter(planType.toLocaleLowerCase()),
          })}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <SubscriptionPaymentStepper planType={planType} />
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
