import UserDeletionModal from '@/deletion/modals/UserDeletionModal'
import { useApolloClient } from '@apollo/client'
import { Button, useDisclosure } from '@chakra-ui/react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { FiTrash2 } from 'react-icons/fi'
import useAdminSelection from '../hooks/useAdminSelection'

interface Props {
  userId: string
}

export default function DeleteUserButton({ userId }: Props) {
  const { t } = useTranslation()
  const modal = useDisclosure()
  const apolloClient = useApolloClient()
  const { close } = useAdminSelection()

  const handleDeleted = () => {
    apolloClient.refetchQueries({ include: ['AdminOrgs', 'AdminUsers'] })
    close()
  }

  return (
    <>
      <Button
        size="sm"
        colorScheme="red"
        leftIcon={<FiTrash2 />}
        onClick={modal.onOpen}
      >
        {t('common.delete')}
      </Button>
      {modal.isOpen && (
        <UserDeletionModal
          userId={userId}
          isOpen
          onClose={modal.onClose}
          onDeleted={handleDeleted}
        />
      )}
    </>
  )
}
