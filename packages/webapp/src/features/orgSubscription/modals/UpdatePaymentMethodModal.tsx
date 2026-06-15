import ModalCloseStaticButton from '@/common/atoms/ModalCloseStaticButton'
import { useOrgContext } from '@/org/contexts/OrgContext'
import { stripePromise } from '@/orgSubscription/api/stripe'
import {
  HStack,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  ModalProps,
  Spinner,
  Text,
  useToast,
} from '@chakra-ui/react'
import { Elements } from '@stripe/react-stripe-js'
import { StripeElementLocale } from '@stripe/stripe-js'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { trpc } from 'src/trpc'
import UpdatePaymentMethodForm from '../components/UpdatePaymentMethodForm'
import { useStripeAppearance } from '../hooks/useStripeAppearance'

type UpdatePaymentMethodModalProps = {
  onUpdate: () => void
} & Omit<ModalProps, 'children'>

export default function UpdatePaymentMethodModal({
  onUpdate,
  ...modalProps
}: UpdatePaymentMethodModalProps) {
  const { t, i18n } = useTranslation()
  const { orgId } = useOrgContext()
  const toast = useToast()
  const [loading, setLoading] = useState(false)
  const [clientSecret, setClientSecret] = useState<string | null>(null)

  const stripeAppearance = useStripeAppearance()

  const createSetupIntent = async () => {
    setLoading(true)
    try {
      const { clientSecret } =
        await trpc.orgSubscription.updateSubscriptionPaymentMethodIntent.mutate(
          { orgId: orgId ?? '' }
        )

      setClientSecret(clientSecret)
    } catch (e) {
      toast({
        title: t('common.errorRetry'),
        description: t('common.errorContact'),
        status: 'error',
        duration: 10000,
        isClosable: true,
      })
      if (modalProps?.onClose) {
        modalProps.onClose()
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    createSetupIntent()
  }, [])

  return (
    <Modal {...modalProps}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <HStack justifyContent="space-between">
            <Text>{t('SubscriptionTabs.accountTab.updateBillingDetails')}</Text>
            <ModalCloseStaticButton />
          </HStack>
        </ModalHeader>
        <ModalBody>
          {loading && (
            <HStack w="100%" mb="10" justifyContent="center">
              <Spinner />
            </HStack>
          )}
          {!loading && clientSecret && (
            <Elements
              stripe={stripePromise}
              options={{
                locale: i18n.language as StripeElementLocale,
                clientSecret,
                appearance: stripeAppearance,
              }}
            >
              <UpdatePaymentMethodForm />
            </Elements>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
