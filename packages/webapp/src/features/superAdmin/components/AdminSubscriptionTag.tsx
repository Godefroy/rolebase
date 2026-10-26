import { Tag } from '@chakra-ui/react'
import {
  Subscription_Payment_Status_Enum,
  Subscription_Plan_Type_Enum,
} from '@gql'
import React from 'react'
import { useTranslation } from 'react-i18next'

interface Props {
  subscription?: {
    status: Subscription_Payment_Status_Enum
    type: Subscription_Plan_Type_Enum
  } | null
}

const statusColors: Partial<Record<Subscription_Payment_Status_Enum, string>> =
  {
    [Subscription_Payment_Status_Enum.Active]: 'green',
    [Subscription_Payment_Status_Enum.Trialing]: 'blue',
    [Subscription_Payment_Status_Enum.PastDue]: 'orange',
    [Subscription_Payment_Status_Enum.Unpaid]: 'red',
  }

export default function AdminSubscriptionTag({ subscription }: Props) {
  const { t } = useTranslation()

  if (!subscription) {
    return (
      <Tag size="sm" variant="subtle" colorScheme="gray">
        {t('SuperAdmin.orgs.noSubscription')}
      </Tag>
    )
  }

  return (
    <Tag
      size="sm"
      variant="subtle"
      colorScheme={statusColors[subscription.status] ?? 'gray'}
      whiteSpace="nowrap"
    >
      {subscription.type} · {subscription.status}
    </Tag>
  )
}
