import ModalCloseStaticButton from '@/common/atoms/ModalCloseStaticButton'
import { useOrgContext } from '@/org/contexts/OrgContext'
import { stripePromise } from '@/orgSubscription/api/stripe'
import {
  Button,
  FormControl,
  HStack,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  ModalProps,
  Spinner,
  Text,
  useToast,
} from '@chakra-ui/react'
import { CustomerBillingDetails } from '@rolebase/shared/model/subscription'
import { AddressElement, Elements } from '@stripe/react-stripe-js'
import {
  StripeAddressElement,
  StripeAddressElementChangeEvent,
  StripeElementLocale,
} from '@stripe/stripe-js'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { trpc } from 'src/trpc'
import { useStripeAppearance } from '../hooks/useStripeAppearance'

type UpdateBillingDetailsModalProps = {
  billingDetails: CustomerBillingDetails | null
  onBillingDetailsUpdated: () => void
} & Omit<ModalProps, 'children'>

const toastDefault = { duration: 4000, isClosable: true }

export default function UpdateBillingDetailsModal({
  billingDetails,
  onBillingDetailsUpdated,
  ...modalProps
}: UpdateBillingDetailsModalProps) {
  const { t, i18n } = useTranslation()
  const { orgId } = useOrgContext()
  const toast = useToast()
  const [loading, setLoading] = useState(false)
  const [disabled, setDisabled] = useState(true)
  const [stripeElement, setStripeElement] =
    useState<StripeAddressElement | null>(null)
  const stripeAppearance = useStripeAppearance()

  const updateBillingDetails = async (
    newBillingDetails: CustomerBillingDetails
  ) => {
    if (!newBillingDetails) return

    setLoading(true)

    try {
      await trpc.orgSubscription.updateSubscriptionBillingDetails.mutate({
        orgId: orgId ?? '',
        billingDetails: newBillingDetails,
      })
      toast({
        title: t('SubscriptionTabs.accountTab.billingDetailsUpdated'),
        status: 'success',
        ...toastDefault,
      })
      onBillingDetailsUpdated()
    } catch (e) {
      toast({
        title: t('SubscriptionTabs.accountTab.billingDetailsUpdateError'),
        status: 'error',
        ...toastDefault,
      })
    } finally {
      setLoading(false)
    }
  }

  const addressChange = (event: StripeAddressElementChangeEvent) => {
    setDisabled(!event.complete)
  }

  const onAddressElementReady = (element: StripeAddressElement) => {
    setStripeElement(element)
  }

  const saveDetails = async () => {
    // @ts-ignore - Method exists
    const fields = await stripeElement?.getValue()

    if (!fields) return

    await updateBillingDetails({
      ...fields.value,
      email: billingDetails?.email,
    })
  }

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
          <FormControl w="100%">
            {!stripeElement && <Spinner m="auto" display="block" />}
            <Elements
              stripe={stripePromise}
              options={{
                loader: 'always',
                locale: i18n.language as StripeElementLocale,
                appearance: stripeAppearance,
              }}
            >
              <AddressElement
                onReady={onAddressElementReady}
                onChange={addressChange}
                options={{
                  mode: 'billing',
                  defaultValues: {
                    name: billingDetails?.name,
                    address: (billingDetails?.address as any) ?? {
                      country: 'FR',
                    },
                  },
                }}
              />
            </Elements>
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button
            isDisabled={disabled}
            isLoading={loading}
            colorScheme="orange"
            onClick={saveDetails}
          >
            {t('common.save')}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
