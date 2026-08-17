import {
  Button,
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
import SubscriptionPaymentModal from '../modals/SubscriptionPaymentModal'
import { SubscriptionPlanCardData } from '../plansTypes'
import SubscriptionFreePlanCardFooter from './SubscriptionFreePlanCardFooter'
import SubscriptionPlanCard from './SubscriptionPlanCard'

export default function SubscriptionPlansFreeLayout(
  gridProps: SimpleGridProps
) {
  const { t, i18n } = useTranslation()
  const plansData = useSubscriptionPlanData()
  const { openInvoice } = useSubscriptionContext()
  const [selectedPlanType, setSelectedPlanType] =
    useState<Subscription_Plan_Type_Enum | null>(null)
  const { isOpen, onOpen, onClose } = useDisclosure()

  const subscribe = (planType: Subscription_Plan_Type_Enum) => () => {
    setSelectedPlanType(planType)
    onOpen()
  }

  const plans: SubscriptionPlanCardData[] = useMemo(() => {
    if (!plansData) return []

    const plansArray: SubscriptionPlanCardData[] = []

    plansArray.push({
      ...plansData.free,
      footer: <SubscriptionFreePlanCardFooter />,
    })
    plansArray.push({
      ...plansData.startup,
      footer: (
        <Flex w="100%" justifyContent="end">
          <Button
            rightIcon={<ChevronRightIcon size="1em" />}
            onClick={subscribe(Subscription_Plan_Type_Enum.Startup)}
            isDisabled={!!openInvoice}
            colorScheme="green"
          >
            {t('SubscriptionPlans.upgradePlan')}
          </Button>
        </Flex>
      ),
    })
    plansArray.push({
      ...plansData.business,
      footer: (
        <Flex w="100%" justifyContent="end">
          <Button
            as="a"
            href={`/${i18n.language}/contact`}
            target="_blank"
            leftIcon={<EmailIcon />}
            colorScheme="gray"
          >
            {t('SubscriptionPlans.contactUs')}
          </Button>
        </Flex>
      ),
    })

    return plansArray
  }, [plansData, openInvoice])

  useEffect(() => {
    if (!isOpen) {
      setSelectedPlanType(null)
    }
  }, [isOpen])

  return (
    <>
      <SimpleGrid w="100%" minChildWidth="280px" spacing="5" {...gridProps}>
        {plans.map((plan) => (
          <SubscriptionPlanCard
            w="100%"
            minH="350px"
            key={plan.type ?? 'free'}
            isCurrent={plan.type === null}
            {...plan}
          />
        ))}
      </SimpleGrid>
      {selectedPlanType && (
        <SubscriptionPaymentModal
          isOpen={isOpen}
          onClose={onClose}
          planType={selectedPlanType!}
        />
      )}
    </>
  )
}
