import OrgDeletionModal from '@/deletion/modals/OrgDeletionModal'
import { useApolloClient } from '@apollo/client'
import { Button, useDisclosure } from '@chakra-ui/react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { FiTrash2 } from 'react-icons/fi'
import useAdminSelection from '../hooks/useAdminSelection'

interface Props {
  orgId: string
}

export default function DeleteOrgButton({ orgId }: Props) {
  const { t } = useTranslation()
  const modal = useDisclosure()
  const apolloClient = useApolloClient()
  const { close } = useAdminSelection()

  const handleDeleted = () => {
    apolloClient.refetchQueries({ include: ['AdminOrgs'] })
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
        <OrgDeletionModal
          orgId={orgId}
          immediate
          isOpen
          onClose={modal.onClose}
          onDeleted={handleDeleted}
        />
      )}
    </>
  )
}
