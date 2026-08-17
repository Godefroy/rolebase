import { Flex, FlexProps } from '@chakra-ui/react'
import { Subscription } from '@rolebase/shared/model/subscription'
import React from 'react'
import { SubscriptionPlan } from '../plansTypes'
import SubscriptionCanceledCard from './SubscriptionCanceledCard'
import SubscriptionPlanSubCard from './SubscriptionPlanSubCard'

type CurrentSubscriptionDetailsProps = {
  currentPlan: SubscriptionPlan
  subscription: Subscription
  onSubscriptionUpdated: () => void
} & FlexProps

export default function CurrentSubscriptionDetails({
  subscription,
  currentPlan,
  onSubscriptionUpdated,
  ...flexProps
}: CurrentSubscriptionDetailsProps) {
  return (
    <Flex
      w="100%"
      gap="5"
      flexWrap="wrap"
      alignItems="stretch"
      flexDir="row"
      {...flexProps}
    >
      <SubscriptionPlanSubCard flex="1" minW="320px" {...currentPlan} />

      {subscription.expiresAt && (
        <SubscriptionCanceledCard
          minW="280px"
          subscriptionEndDate={subscription.expiresAt}
          onSubscriptionResumed={onSubscriptionUpdated}
        />
      )}
    </Flex>
  )
}
