import MemberAvatar from '@/member/components/MemberAvatar'
import useSubscriptionData from '@/orgSubscription/hooks/useSubscriptionData'
import { useOrgContext } from '@/org/contexts/OrgContext'
import { Box, Flex, Heading, Input, Text, VStack } from '@chakra-ui/react'
import React from 'react'
import { useTranslation } from 'react-i18next'

interface Props {
  // Email typed for each member, by member id
  emails: Record<string, string>
  onChange(emails: Record<string, string>): void
}

// Invite the members typed at the roles step, by email. Optional: members
// without an account are a normal use of the product.
// The plan's seats cap the invitations. Upgrading is left for after the setup:
// the setup is mandatory, so a link to the subscription page would be a dead
// end. Once the seats are filled, the remaining fields are disabled instead.
export default function OrgSetupStepInvite({ emails, onChange }: Props) {
  const { t } = useTranslation()
  const { orgData } = useOrgContext()
  const { availableSeats } = useSubscriptionData()

  const members =
    orgData?.members.filter((m) => !m.userId && !m.inviteEmail) ?? []
  const hasEmail = (memberId: string) => !!emails[memberId]?.trim()
  const filledCount = members.filter((m) => hasEmail(m.id)).length
  const isLimitReached = filledCount >= availableSeats

  return (
    <VStack spacing={5} align="stretch">
      <Box>
        <Heading as="h1" size="md">
          {t('OrgSetupModal.invite.heading')}
        </Heading>
        <Text mt={1} fontSize="sm" color="gray.500">
          {t('OrgSetupModal.invite.help')}
        </Text>
      </Box>

      {members.length === 0 ? (
        <Text>{t('OrgSetupModal.invite.empty')}</Text>
      ) : (
        <VStack spacing={2} align="stretch">
          {members.map((member) => (
            <Flex key={member.id} gap={2} align="center">
              <Flex flex={1} minW={0} gap={2} align="center">
                <MemberAvatar member={member} size="sm" noTooltip />
                <Text noOfLines={1}>{member.name}</Text>
              </Flex>
              <Input
                flex={1}
                type="email"
                aria-label={t('OrgSetupModal.invite.emailLabel', {
                  name: member.name,
                })}
                placeholder={t('MembersInviteModal.emailPlaceholder')}
                value={emails[member.id] ?? ''}
                // Filled fields stay editable, to swap someone for another
                isDisabled={isLimitReached && !hasEmail(member.id)}
                onChange={(e) =>
                  onChange({ ...emails, [member.id]: e.target.value })
                }
              />
            </Flex>
          ))}
        </VStack>
      )}

      <Text fontSize="sm" color="gray.500">
        {t('OrgSetupModal.invite.pricing')}
      </Text>

      {isLimitReached && members.length > availableSeats && (
        <Text fontSize="sm">
          {t('OrgSetupModal.invite.limitReached', { count: availableSeats })}
        </Text>
      )}
    </VStack>
  )
}
