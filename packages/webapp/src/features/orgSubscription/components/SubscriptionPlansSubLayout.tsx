import {
  Button,
  Divider,
  Flex,
  SimpleGrid,
  SimpleGridProps,
  useDisclosure,
} from '@chakra-ui/react'
import { Subscription_Plan_Type_Enum } from '@gql'
import React, { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ChevronRightIcon, EmailIcon } from 'src/icons'
import { useSubscriptionContext } from '../contexts/SubscriptionContext'
import { useSubscriptionPlanData } from '../hooks/useSubscriptionPlanData'
import CancelSubscriptionModal from '../modals/CancelSubscriptionModal'
import SubscriptionPaymentModal from '../modals/SubscriptionPaymentModal'
import { SubscriptionPlan, SubscriptionPlanCardData } from '../plansTypes'
import CurrentSubscriptionDetails from './CurrentSubscriptionDetails'
import SubscriptionPlanCard from './SubscriptionPlanCard'

export default function SubscriptionPlansSubLayout(gridProps: SimpleGridProps) {
  const { t, i18n } = useTranslation()
  const plansData = useSubscriptionPlanData()
  const { subscription, openInvoice, refetchSubscription } =
    useSubscriptionContext()
  const [currentPlanData, setCurrentPlanData] = useState<SubscriptionPlan>()
  const {
    isOpen: isPaymentOpen,
    onOpen: onPaymentOpen,
    onClose: onPaymentClose,
  } = useDisclosure()
  const {
    isOpen: isUnsubscribeOpen,
    onOpen: onUnsubscribeOpen,
    onClose: onUnsubscribeClose,
  } = useDisclosure()
  const [selectedPlanType, setSelectedPlanType] =
    useState<Subscription_Plan_Type_Enum | null>(null)
  const subscribe = (planType: Subscription_Plan_Type_Enum) => async () => {
    setSelectedPlanType(planType)
    onPaymentOpen()
  }

  useEffect(() => {
    if (!plansData || !subscription) return

    switch (subscription.type) {
      case Subscription_Plan_Type_Enum.Startup:
        setCurrentPlanData(plansData.startup)
        break
      case Subscription_Plan_Type_Enum.Business:
        setCurrentPlanData(plansData.business)
        break
      default:
        setCurrentPlanData(plansData.free)
    }
  }, [plansData, subscription])

  const plans: SubscriptionPlanCardData[] = useMemo(() => {
    if (!plansData || !subscription) return []

    const plansArray: SubscriptionPlanCardData[] = []

    plansArray.push({
      ...plansData.free,
      footer: (
        <Flex w="100%" justifyContent="end">
          <Button
            variant="outline"
            rightIcon={
              subscription.expiresAt ? undefined : (
                <ChevronRightIcon size="1em" />
              )
            }
            onClick={onUnsubscribeOpen}
            isDisabled={!!subscription.expiresAt || !!openInvoice}
          >
            {subscription.expiresAt
              ? t('SubscriptionPlans.activateOnSubscriptionEnd')
              : t('SubscriptionPlans.downgradePlan')}
          </Button>
        </Flex>
      ),
    })

    if (subscription.type !== Subscription_Plan_Type_Enum.Startup) {
      plansArray.push({
        ...plansData.startup,
        footer: (
          <Flex w="100%" justifyContent="end">
            <Button
              rightIcon={<ChevronRightIcon size="1em" />}
              variant="outline"
              onClick={subscribe(Subscription_Plan_Type_Enum.Startup)}
              isDisabled={!!openInvoice}
              colorScheme="gray"
            >
              {subscription.type
                ? t('SubscriptionPlans.selectPlan')
                : t('SubscriptionPlans.upgradePlan')}
            </Button>
          </Flex>
        ),
      })
    }

    if (subscription.type !== Subscription_Plan_Type_Enum.Business) {
      plansArray.push({
        ...plansData.business,
        footer: (
          <Flex w="100%" justifyContent="end">
            <Button
              as="a"
              variant="outline"
              href={`/${i18n.language}/contact`}
              target="_blank"
              leftIcon={<EmailIcon />}
            >
              {t('SubscriptionPlans.contactUs')}
            </Button>
          </Flex>
        ),
      })
    }

    return plansArray
  }, [plansData, subscription, openInvoice])

  if (!subscription) return null

  return (
    <>
      <Flex w="100%" gap="5" alignItems="center" flexDir="column">
        {currentPlanData && (
          <CurrentSubscriptionDetails
            subscription={subscription}
            currentPlan={currentPlanData}
            onSubscriptionUpdated={refetchSubscription}
          />
        )}
        <Divider />
        <SimpleGrid w="100%" minChildWidth="280px" spacing="5" {...gridProps}>
          {plans.map((plan) => (
            <SubscriptionPlanCard
              w="100%"
              minH="350px"
              key={plan.type ?? 'free'}
              isCurrent={false}
              {...plan}
            />
          ))}
        </SimpleGrid>
      </Flex>
      {selectedPlanType && (
        <SubscriptionPaymentModal
          isOpen={isPaymentOpen}
          onClose={onPaymentClose}
          planType={selectedPlanType!}
        />
      )}
      <CancelSubscriptionModal
        isOpen={isUnsubscribeOpen}
        onClose={onUnsubscribeClose}
        onSubscriptionCanceled={refetchSubscription}
      />
    </>
  )
}
