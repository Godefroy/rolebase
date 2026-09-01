import useOrg from '@/org/hooks/useOrg'
import { useOrgContext } from '@/org/contexts/OrgContext'
import { stripePromise } from '@/orgSubscription/api/stripe'
import { ChevronLeftIcon } from '@chakra-ui/icons'
import {
  Box,
  Button,
  Collapse,
  Flex,
  Heading,
  Spacer,
  Step,
  StepIcon,
  StepIndicator,
  StepNumber,
  StepSeparator,
  StepStatus,
  Stepper,
  useStepContext,
  useSteps,
  useToast,
} from '@chakra-ui/react'
import { Subscription_Plan_Type_Enum } from '@gql'
import { CustomerBillingDetails } from '@rolebase/shared/model/subscription'
import { Elements } from '@stripe/react-stripe-js'
import {
  Stripe,
  StripeAddressElementChangeEvent,
  StripeElementLocale,
  StripeElements,
} from '@stripe/stripe-js'
import React, { FormEvent, ReactNode, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { track } from 'src/analytics'
import { trpc } from 'src/trpc'
import { useStripeAppearance } from '../hooks/useStripeAppearance'
import StripeBillingDetailsForm from './StripeBillingDetailsForm'
import StripePaymentForm from './StripePaymentForm'
import SubscriptionSummary from './SubscriptionSummary'

type SubscriptionPaymentStepperProps = {
  planType: Subscription_Plan_Type_Enum
}

export default function SubscriptionPaymentStepper({
  planType,
}: SubscriptionPaymentStepperProps) {
  const { t, i18n } = useTranslation()
  const { activeStep, goToNext, goToPrevious } = useSteps({
    index: 0,
    count: 3,
  })
  const { orgId } = useOrgContext()
  const org = useOrg(orgId)
  const [stripe, setStripe] = useState<Stripe>()
  const toast = useToast()
  const [loading, setLoading] = useState(false)
  const [billingDetailsComplete, setBillingDetailsComplete] = useState(false)
  const [paymentDetailsComplete, setPaymentDetailsComplete] = useState(false)
  const [paymentElement, setPaymentElement] = useState<StripeElements>()
  const [billingDetails, setBillingDetails] = useState<CustomerBillingDetails>({
    name: org?.name,
  })
  const [promoCode, setPromoCode] = useState<string>()
  const [clientSecret, setClientSecret] = useState<string>()
  const stripeAppearance = useStripeAppearance()

  const addressDetailsChange = (event: StripeAddressElementChangeEvent) => {
    setBillingDetailsComplete(!event.complete)

    if (event.complete) {
      setBillingDetails(event.value)
    }
  }

  const updateBillingDetails = async (
    newBillingDetails: CustomerBillingDetails
  ) => {
    if (!newBillingDetails)
      throw new Error(t('SubscriptionTabs.accountTab.invalidBillingDetails'))

    await trpc.orgSubscription.updateSubscriptionBillingDetails.mutate({
      orgId: orgId ?? '',
      billingDetails: newBillingDetails,
    })
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()

    if (!stripe || !paymentElement) {
      return
    }
    setLoading(true)

    try {
      await updateBillingDetails(billingDetails)

      track('subscription_payment_submitted', {
        plan: planType,
        promoCode: !!promoCode,
      })

      const { error } = await stripe.confirmPayment({
        elements: paymentElement,
        confirmParams: {
          return_url: `${
            new URL('', import.meta.url).origin
          }/orgs/${orgId}/settings/subscription`,
        },
      })

      if (error) throw error
    } catch (e: any) {
      track('subscription_payment_failed', {
        plan: planType,
        stage: 'confirm',
        reason: e?.message,
      })
      toast({
        title: e.message,
        status: 'error',
      })
    } finally {
      setLoading(false)
    }
  }

  const subscribe = async (): Promise<boolean> => {
    const address = billingDetails.address
    if (!address) return false

    setLoading(true)
    try {
      const res = await trpc.orgSubscription.subscribeOrg.mutate({
        orgId: orgId ?? '',
        planType,
        promotionCode: promoCode,
        address,
      })

      if (res.isFreeOrTrial) {
        location.reload()
      }

      setClientSecret(res.clientSecret)
      return true
    } catch (e: any) {
      const hasOpenInvoice = e?.data?.code === 'CONFLICT'
      track('subscription_payment_failed', {
        plan: planType,
        stage: 'intent',
        reason: hasOpenInvoice ? 'open_invoice' : e?.message,
      })
      toast({
        title: hasOpenInvoice
          ? t('SubscriptionTabs.openInvoice.title')
          : t('common.errorRetry'),
        description: hasOpenInvoice
          ? t('SubscriptionTabs.openInvoice.blocked')
          : t('common.errorContact'),
        duration: 10000,
        isClosable: true,
        status: 'error',
      })
      return false
    } finally {
      setLoading(false)
    }
  }

  const handleNext = async () => {
    if (activeStep === 0) {
      track('subscription_billing_submitted', {
        plan: planType,
        country: billingDetails.address?.country,
      })
    }
    // Stay on the summary when the subscription could not be created,
    // the payment step has no client secret to work with
    if (activeStep === 1 && !(await subscribe())) return
    goToNext()
  }

  const isNextDisabled = useMemo(() => {
    if (activeStep === 0) return billingDetailsComplete
    if (activeStep === 1) return paymentDetailsComplete

    return false
  }, [activeStep, billingDetailsComplete, paymentDetailsComplete])

  return (
    <form onSubmit={handleSubmit}>
      <Stepper index={activeStep} orientation="vertical" gap="0">
        <StepItem label={t('SubscriptionTabs.paymentModal.details')}>
          <Elements
            stripe={stripePromise}
            options={{
              loader: 'always',
              locale: i18n.language as StripeElementLocale,
              appearance: stripeAppearance,
            }}
          >
            <StripeBillingDetailsForm
              onDetailsChanged={addressDetailsChange}
              defaultValues={{
                name: billingDetails.name,
                address: {
                  city: null,
                  line1: null,
                  line2: null,
                  postal_code: null,
                  state: null,
                  country: 'FR',
                },
              }}
            />
          </Elements>
        </StepItem>

        <StepItem label={t('SubscriptionTabs.paymentModal.summary')}>
          {billingDetails && (
            <SubscriptionSummary
              planType={planType}
              onPromoApplied={setPromoCode}
              billingDetails={billingDetails}
            />
          )}
        </StepItem>

        <StepItem label={t('SubscriptionTabs.paymentModal.payment')}>
          {clientSecret && (
            <Elements
              stripe={stripePromise}
              options={{
                loader: 'always',
                locale: i18n.language as StripeElementLocale,
                appearance: stripeAppearance,
                clientSecret,
              }}
            >
              <StripePaymentForm
                onElementChange={setPaymentElement}
                onStripeChange={setStripe}
                onValidityChanged={setPaymentDetailsComplete}
              />
            </Elements>
          )}
        </StepItem>
      </Stepper>

      <Flex py={2}>
        <Button
          isDisabled={activeStep === 0}
          mr={4}
          leftIcon={<ChevronLeftIcon />}
          onClick={goToPrevious}
          variant="ghost"
        >
          {t('SubscriptionTabs.paymentModal.prev')}
        </Button>

        <Spacer />

        {activeStep < 2 && (
          <Button
            isLoading={loading}
            isDisabled={isNextDisabled}
            colorScheme="blue"
            onClick={handleNext}
          >
            {t('SubscriptionTabs.paymentModal.next')}
          </Button>
        )}
        {activeStep === 2 && (
          <Button
            isLoading={loading}
            isDisabled={!paymentDetailsComplete}
            type="submit"
            colorScheme="green"
          >
            {t('SubscriptionTabs.paymentModal.confirm')}
          </Button>
        )}
      </Flex>
    </form>
  )
}

interface StepItemProps {
  label: string
  children: ReactNode
}

function StepItem({ label, children }: StepItemProps) {
  const { status } = useStepContext()

  return (
    <Step>
      <StepIndicator>
        <StepStatus
          complete={<StepIcon />}
          incomplete={<StepNumber />}
          active={<StepNumber />}
        />
      </StepIndicator>

      <Box flex={1} ml={3} mr={2} pb={10}>
        <Heading
          as="h3"
          fontSize="lg"
          h="var(--stepper-indicator-size)"
          lineHeight="var(--stepper-indicator-size)"
          mb={5}
        >
          {label}
        </Heading>
        <Collapse in={status === 'active'}>
          {status === 'active' && children}
        </Collapse>
      </Box>

      <StepSeparator />
    </Step>
  )
}
