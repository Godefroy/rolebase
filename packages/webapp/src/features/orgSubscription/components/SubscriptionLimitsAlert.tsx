import { usePathInOrg } from '@/org/hooks/usePathInOrg'
import {
  Alert,
  AlertDescription,
  Link,
  StyleProps,
  Text,
} from '@chakra-ui/react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Link as RouterLink } from 'react-router'

interface Props extends StyleProps {
  subscriptionSeats: number
}

export default function SubscriptionLimitsAlert({
  subscriptionSeats,
  ...styleProps
}: Props) {
  const { t } = useTranslation()
  const subscriptionPath = usePathInOrg('settings/subscription')

  return (
    <Alert
      status="warning"
      bg="orange.50"
      _dark={{ bg: 'orange.900' }}
      borderRadius="md"
      {...styleProps}
    >
      <AlertDescription>
        <Text>
          {t('SubscriptionLimitsAlert.notEnoughSeats', {
            limit: subscriptionSeats,
          })}{' '}
          <Link
            as={RouterLink}
            to={subscriptionPath}
            color="blue.500"
            fontWeight="semibold"
          >
            {t('SubscriptionLimitsAlert.upgradePlan')}
          </Link>
        </Text>
      </AlertDescription>
    </Alert>
  )
}
