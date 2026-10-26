import { Button, useDisclosure } from '@chakra-ui/react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import UserDeletionModal from '../modals/UserDeletionModal'

interface Props {
  userId: string
}

export default function DeleteUserButton({ userId }: Props) {
  const { t } = useTranslation()
  const modal = useDisclosure()

  return (
    <>
      <Button
        size="xs"
        colorScheme="red"
        variant="ghost"
        onClick={modal.onOpen}
      >
        {t('common.delete')}
      </Button>
      {modal.isOpen && (
        <UserDeletionModal userId={userId} isOpen onClose={modal.onClose} />
      )}
    </>
  )
}
