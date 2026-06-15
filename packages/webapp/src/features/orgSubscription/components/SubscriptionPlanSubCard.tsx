import FadeCard from '@/common/atoms/FadeCard'
import { useOrgContext } from '@/org/contexts/OrgContext'
import ParticipantsGroup from '@/participants/components/ParticipantsGroup'
import {
  Box,
  CardProps,
  Divider,
  Flex,
  Tag,
  Text,
  useBreakpointValue,
} from '@chakra-ui/react'
import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { SubscriptionPlan } from '../plansTypes'
import SubscriptionFeatures from './SubscriptionFeatures'
import SubscriptionPlanIcon from './SubscriptionPlanIcon'

type SubscriptionPlanCard = SubscriptionPlan & CardProps

export default function SubscriptionPlanSubCard({
  title,
  desc,
  features,
  color,
  type,
  ...cardProps
}: SubscriptionPlanCard) {
  const { t } = useTranslation()
  const nbParticipantBreakpoint = useBreakpointValue({
    base: 4,
    md: 7,
  })
  const members = useOrgContext().orgData?.members
  const filteredMembers = useMemo(
    () => members?.filter((mem) => !!mem.userId) ?? [],
    [members]
  )

  return (
    <FadeCard
      p="4"
      pb="10"
      flexDir="column"
      justifyContent="space-between"
      colorScheme={color}
      {...cardProps}
    >
      <Box>
        <Flex flexDir="row" justifyContent="space-between">
          <Flex flexDir="column" gap="2">
            <Flex flexDir="row" alignItems="center" gap="2">
              <SubscriptionPlanIcon type={type} size={24} />
              <Text fontWeight={700} fontSize="24">
                {title}
              </Text>
            </Flex>
            <Text
              _dark={{
                color: 'gray.200',
              }}
              color="gray.400"
              fontWeight={600}
              maxWidth="80%"
            >
              {desc}
            </Text>
          </Flex>

          <Flex flexDir="column" gap="2" alignItems="end" minW="110px">
            {filteredMembers && (
              <ParticipantsGroup
                max={nbParticipantBreakpoint}
                size="sm"
                participants={filteredMembers}
              />
            )}
            <Tag
              borderRadius="full"
              size="lg"
              bg={`${color}.500`}
              color="white"
            >
              {t('SubscriptionPlans.currentPlan')}
            </Tag>
          </Flex>
        </Flex>
        <Divider my="4" />
        <Box ml={['auto', 'auto', '20%']}>
          <Text as="b" fontSize={18}>
            {t('SubscriptionPlans.included')}
          </Text>
          <SubscriptionFeatures features={features} />
        </Box>
      </Box>
    </FadeCard>
  )
}
