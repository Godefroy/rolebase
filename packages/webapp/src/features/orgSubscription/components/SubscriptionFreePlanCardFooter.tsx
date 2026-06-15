import { useOrgContext } from '@/org/contexts/OrgContext'
import ParticipantsGroup from '@/participants/components/ParticipantsGroup'
import { Flex, FlexProps, Text, useBreakpointValue } from '@chakra-ui/react'
import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

const MAX_MEMBERS_FREE = 5

export default function SubscriptionFreePlanCardFooter(props: FlexProps) {
  const { t } = useTranslation()
  const members = useOrgContext().orgData?.members
  const filteredMembers = useMemo(
    () => members?.filter((mem) => !!mem.userId) ?? [],
    [members]
  )
  const size = useBreakpointValue({
    base: 'xs',
    sm: 'sm',
    md: 'md',
  })

  return (
    <Flex
      flexDir="row"
      alignItems="center"
      justifyContent="space-between"
      {...props}
    >
      <Text
        fontWeight={600}
        _dark={{
          color: 'gray.300',
        }}
        color="gray.500"
      >
        {t('SubscriptionPlans.activeMember', {
          count: filteredMembers?.length ?? 0,
          total: MAX_MEMBERS_FREE,
        })}
      </Text>
      {filteredMembers && (
        <ParticipantsGroup
          size={size}
          max={MAX_MEMBERS_FREE}
          participants={filteredMembers}
        />
      )}
    </Flex>
  )
}
