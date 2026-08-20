import { Button, Flex, Text } from '@chakra-ui/react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { PendingInvitation } from '../hooks/usePendingInvitations'

interface Props {
  invitation: PendingInvitation
  isLoading: boolean
  isDisabled: boolean
  onAccept(invitation: PendingInvitation): void
}

export default function PendingInvitationItem({
  invitation,
  isLoading,
  isDisabled,
  onAccept,
}: Props) {
  const { t } = useTranslation()

  return (
    <Flex
      align="center"
      gap={3}
      borderWidth={1}
      borderRadius="md"
      px={4}
      py={3}
    >
      <Text fontWeight="bold" flex={1} textAlign="left" noOfLines={1}>
        {invitation.orgName}
      </Text>
      <Button
        colorScheme="blue"
        size="sm"
        isLoading={isLoading}
        isDisabled={isDisabled}
        onClick={() => onAccept(invitation)}
      >
        {t('PendingInvitationsModal.join')}
      </Button>
    </Flex>
  )
}
