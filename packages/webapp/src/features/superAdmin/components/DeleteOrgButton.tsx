import { Button, useDisclosure } from '@chakra-ui/react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import OrgDeletionModal from '../modals/OrgDeletionModal'

interface Props {
  orgId: string
}

export default function DeleteOrgButton({ orgId }: Props) {
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
        <OrgDeletionModal orgId={orgId} isOpen onClose={modal.onClose} />
      )}
    </>
  )
}
