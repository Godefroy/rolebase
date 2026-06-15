import { useOrgContext } from '@/org/contexts/OrgContext'
import { Button, Card, CardProps, Flex, Text, useToast } from '@chakra-ui/react'
import { format } from 'date-fns'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FiFeather } from 'react-icons/fi'
import { trpc } from 'src/trpc'

type SubscriptionCanceledCardProps = {
  subscriptionEndDate: string
  onSubscriptionResumed: () => void
} & CardProps

export default function SubscriptionCanceledCard({
  subscriptionEndDate,
  onSubscriptionResumed,
  ...cardProps
}: SubscriptionCanceledCardProps) {
  const { t } = useTranslation()
  const { orgId } = useOrgContext()
  const toast = useToast()
  const [loading, setLoading] = useState<boolean>(false)

  const resumeSub = async () => {
    setLoading(true)

    try {
      await trpc.orgSubscription.resumeSubscription.mutate({
        orgId: orgId ?? '',
      })
      toast({
        title: t('SubscriptionPlans.subscriptionResumed'),
        status: 'success',
      })
      onSubscriptionResumed()
    } catch (e: any) {
      toast({
        title: 'Something went wrong ' + e.message,
        status: 'error',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card p="4" variant="outline" {...cardProps}>
      <Flex p="4" w="100%" gap="5" flexDir="row">
        <Flex flexDir="column" gap="1">
          <Text fontSize={16} fontWeight={500}>
            {t('SubscriptionPlans.subscriptionExpires')}
          </Text>
          <Text fontSize={26} fontWeight={700}>
            {format(new Date(subscriptionEndDate), 'dd/MM/uuuu')}
          </Text>
        </Flex>
      </Flex>
      <Button
        m="auto"
        onClick={resumeSub}
        leftIcon={<FiFeather />}
        isLoading={loading}
        variant="outline"
      >
        {t('SubscriptionPlans.reactivateSubscription')}
      </Button>
    </Card>
  )
}
