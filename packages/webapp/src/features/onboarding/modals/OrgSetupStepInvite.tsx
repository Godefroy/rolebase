import MemberAvatar from '@/member/components/MemberAvatar'
import useSubscriptionData from '@/orgSubscription/hooks/useSubscriptionData'
import { useOrgContext } from '@/org/contexts/OrgContext'
import {
  Box,
  Button,
  Flex,
  Heading,
  IconButton,
  Input,
  Text,
  VStack,
} from '@chakra-ui/react'
import { nanoid } from 'nanoid'
import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { AddIcon, DeleteIcon } from 'src/icons'
import { isNewInvite, NEW_INVITE_PREFIX } from '../getValidInvites'

interface Props {
  // Email typed for each member by member id, or for a new person (see
  // NEW_INVITE_PREFIX)
  emails: Record<string, string>
  onChange(emails: Record<string, string>): void
}

// Invite the members typed at the roles step by email, and anyone else by
// their address alone. Optional: members without an account are a normal use
// of the product.
// The plan's seats cap the invitations. Upgrading is left for after the setup:
// the setup is mandatory, so a link to the subscription page would be a dead
// end. Once the seats are filled, the remaining fields are disabled instead.
export default function OrgSetupStepInvite({ emails, onChange }: Props) {
  const { t } = useTranslation()
  const { orgData } = useOrgContext()
  const { availableSeats } = useSubscriptionData()

  const members =
    orgData?.members.filter((m) => !m.userId && !m.inviteEmail) ?? []
  const newIds = Object.keys(emails).filter(isNewInvite)
  const hasEmail = (id: string) => !!emails[id]?.trim()
  const filledCount = Object.keys(emails).filter(hasEmail).length
  const isLimitReached = filledCount >= availableSeats

  const handleAdd = () =>
    onChange({ ...emails, [NEW_INVITE_PREFIX + nanoid(8)]: '' })

  const handleRemove = (id: string) =>
    onChange(
      Object.fromEntries(Object.entries(emails).filter(([key]) => key !== id))
    )

  // Nobody typed at the roles step: offer a first field right away
  useEffect(() => {
    if (members.length === 0 && newIds.length === 0) handleAdd()
  }, [])

  const renderInput = (id: string, label: string) => (
    <Input
      flex={1}
      type="email"
      aria-label={label}
      placeholder={t('MembersInviteModal.emailPlaceholder')}
      value={emails[id] ?? ''}
      // Filled fields stay editable, to swap someone for another
      isDisabled={isLimitReached && !hasEmail(id)}
      onChange={(e) => onChange({ ...emails, [id]: e.target.value })}
    />
  )

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

      <VStack spacing={2} align="stretch">
        {members.map((member) => (
          <Flex key={member.id} gap={2} align="center">
            <Flex flex={1} minW={0} gap={2} align="center">
              <MemberAvatar member={member} size="sm" noTooltip />
              <Text noOfLines={1}>{member.name}</Text>
            </Flex>
            {renderInput(
              member.id,
              t('OrgSetupModal.invite.emailLabel', { name: member.name })
            )}
          </Flex>
        ))}
        {newIds.map((id) => (
          <Flex key={id} gap={2} align="center">
            {renderInput(id, t('OrgSetupModal.invite.newEmailLabel'))}
            <IconButton
              aria-label={t('common.delete')}
              icon={<DeleteIcon size="1em" />}
              variant="ghost"
              onClick={() => handleRemove(id)}
            />
          </Flex>
        ))}
      </VStack>

      <Box>
        <Button
          size="sm"
          variant="outline"
          leftIcon={<AddIcon size="1em" />}
          isDisabled={isLimitReached}
          onClick={handleAdd}
        >
          {t('OrgSetupModal.invite.add')}
        </Button>
      </Box>

      <Text fontSize="sm" color="gray.500">
        {t('OrgSetupModal.invite.pricing')}
      </Text>

      {isLimitReached && members.length + newIds.length > availableSeats && (
        <Text fontSize="sm">
          {t('OrgSetupModal.invite.limitReached', { count: availableSeats })}
        </Text>
      )}
    </VStack>
  )
}
