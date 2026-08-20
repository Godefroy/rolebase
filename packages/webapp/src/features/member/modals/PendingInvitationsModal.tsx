import BrandModal from '@/common/atoms/BrandModal'
import TextError from '@/common/atoms/TextError'
import { Box, Button, Heading, VStack } from '@chakra-ui/react'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { trpc } from 'src/trpc'
import { PendingInvitation } from '../hooks/usePendingInvitations'
import PendingInvitationItem from './PendingInvitationItem'

interface Props {
  invitations: PendingInvitation[]
  onCreateOrg(): void
}

// Offers a user with no org to join the orgs they have been invited to, instead
// of going through the onboarding wizard that creates a new org.
export default function PendingInvitationsModal({
  invitations,
  onCreateOrg,
}: Props) {
  const { t } = useTranslation()
  const [acceptingId, setAcceptingId] = useState<string | undefined>()
  const [error, setError] = useState<Error | undefined>()

  // Accepting adds the org to the subscribed list, which redirects into it
  const handleAccept = async (invitation: PendingInvitation) => {
    setAcceptingId(invitation.memberId)
    setError(undefined)
    try {
      await trpc.member.acceptMemberInvitation.mutate({
        memberId: invitation.memberId,
        token: invitation.token,
      })
    } catch (e: any) {
      setAcceptingId(undefined)
      setError(new Error(e?.message || t('common.error')))
    }
  }

  return (
    <BrandModal
      size="lg"
      bodyProps={{ mx: 10 }}
      backButton={false}
      isOpen
      closeOnEsc={false}
      onClose={() => undefined}
    >
      <Heading as="h1" size="md" mb={7}>
        {t('PendingInvitationsModal.heading', { count: invitations.length })}
      </Heading>

      <VStack spacing={3} align="stretch">
        {invitations.map((invitation) => (
          <PendingInvitationItem
            key={invitation.memberId}
            invitation={invitation}
            isLoading={acceptingId === invitation.memberId}
            isDisabled={!!acceptingId}
            onAccept={handleAccept}
          />
        ))}
      </VStack>

      {error && (
        <Box mt={5}>
          <TextError error={error} />
        </Box>
      )}

      <Box mt={8} textAlign="center">
        <Button variant="ghost" isDisabled={!!acceptingId} onClick={onCreateOrg}>
          {t('PendingInvitationsModal.createOrg')}
        </Button>
      </Box>
    </BrandModal>
  )
}
