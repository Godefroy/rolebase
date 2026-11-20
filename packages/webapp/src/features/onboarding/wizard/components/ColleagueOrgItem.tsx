import { Button, Flex, Spacer, Tag, Text, useToast } from '@chakra-ui/react'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { track } from 'src/analytics'
import { trpc } from 'src/trpc'
import { ColleagueOrg } from '../hooks/useColleagueOrgs'

interface Props {
  org: ColleagueOrg
  onRequested(): Promise<unknown>
}

// A colleagues' org, with a button to request access or the request status
export default function ColleagueOrgItem({ org, onRequested }: Props) {
  const { t } = useTranslation()
  const toast = useToast()
  const [loading, setLoading] = useState(false)

  const handleRequest = async () => {
    setLoading(true)
    try {
      await trpc.member.requestOrgAccess.mutate({ orgId: org.orgId })
      track('onboarding_access_requested')
      await onRequested()
    } catch (error: any) {
      toast({
        title: t('common.error'),
        description: error?.message || undefined,
        status: 'error',
      })
    }
    setLoading(false)
  }

  return (
    <Flex
      align="center"
      gap={3}
      px={4}
      py={3}
      borderWidth="1px"
      borderRadius="md"
    >
      <Text fontWeight="semibold">{org.orgName}</Text>
      <Spacer />
      {org.requestStatus === 'Pending' ? (
        <Tag colorScheme="blue">{t('Onboarding.join.pending')}</Tag>
      ) : org.requestStatus === 'Refused' ? (
        <Tag colorScheme="gray">{t('Onboarding.join.refused')}</Tag>
      ) : (
        <Button
          size="sm"
          colorScheme="blue"
          isLoading={loading}
          onClick={handleRequest}
        >
          {t('Onboarding.join.request')}
        </Button>
      )}
    </Flex>
  )
}
