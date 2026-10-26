import DeletionCard from '@/deletion/components/DeletionCard'
import UserDeletionModal from '@/deletion/modals/UserDeletionModal'
import { Stack, Text, useDisclosure } from '@chakra-ui/react'
import { useAccountDeletionMembersSubscription } from '@gql'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'
import { useAuth } from '../hooks/useAuth'
import useUserSignOut from '../hooks/useUserSignOut'
import AccountDeletionOrgItem from './AccountDeletionOrgItem'

// Account deletion, possible once the user is no longer in any org
export default function AccountDeletionCard() {
  const { t } = useTranslation()
  const { user } = useAuth()
  const { data } = useAccountDeletionMembersSubscription({
    skip: !user,
    variables: { userId: user?.id ?? '' },
  })
  const members = data?.member
  const signOut = useUserSignOut()
  const navigate = useNavigate()
  const modal = useDisclosure()

  // The session is already revoked: signing out only clears it locally
  const handleDeleted = async () => {
    await signOut().catch(() => {})
    navigate('/account-deleted')
  }

  return (
    <>
      <DeletionCard
        title={t('AccountDeletionCard.title')}
        description={t('AccountDeletionCard.description')}
        buttonLabel={t('AccountDeletionCard.button')}
        isDisabled={!members || members.length > 0}
        onClick={modal.onOpen}
      >
        {members && members.length > 0 && (
          <Stack spacing={2}>
            <Text fontSize="sm" fontWeight="medium">
              {t('AccountDeletionCard.blocked', { count: members.length })}
            </Text>
            {members.map((member) => (
              <AccountDeletionOrgItem key={member.id} member={member} />
            ))}
          </Stack>
        )}
      </DeletionCard>
      {modal.isOpen && (
        <UserDeletionModal
          isOpen
          onClose={modal.onClose}
          onDeleted={handleDeleted}
        />
      )}
    </>
  )
}
