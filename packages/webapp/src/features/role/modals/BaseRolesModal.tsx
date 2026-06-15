import ListItemWithButtons from '@/common/atoms/ListItemWithButtons'
import useOrgBaseRoles from '@/org/hooks/useOrgBaseRoles'
import {
  Alert,
  AlertDescription,
  AlertIcon,
  Button,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
  UseModalProps,
} from '@chakra-ui/react'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { CreateIcon, DeleteIcon } from 'src/icons'
import BaseRoleCreateModal from './BaseRoleCreateModal'
import RoleDeleteModal from './RoleDeleteModal'
import RoleEditModal from './RoleEditModal'

export default function BaseRolesModal(modalProps: UseModalProps) {
  const { t } = useTranslation()
  const roles = useOrgBaseRoles()

  // Modals
  const [roleId, setRoleId] = useState<string | undefined>()
  const editModal = useDisclosure()
  const createModal = useDisclosure()
  const deleteModal = useDisclosure()

  // Get selected role from store to avoid displaying a modal for a role doesn't exist anymore
  const role = roles?.find((role) => role.id === roleId)

  const handleEdit = (id: string) => {
    setRoleId(id)
    editModal.onOpen()
  }

  const handleDelete = (id: string) => {
    setRoleId(id)
    deleteModal.onOpen()
  }

  return (
    <>
      <Modal size="md" {...modalProps}>
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalHeader>{t('BaseRolesModal.heading')}</ModalHeader>

          <ModalBody>
            <Alert status="info" mb={5}>
              <AlertIcon />
              <AlertDescription>{t('BaseRolesModal.info')}</AlertDescription>
            </Alert>

            {!roles?.length ? (
              <Text fontStyle="italic">{t('BaseRolesModal.empty')}</Text>
            ) : (
              roles?.map((role) => (
                <ListItemWithButtons
                  key={role.id}
                  onClick={() => handleEdit(role.id)}
                  buttons={
                    <IconButton
                      aria-label={t('common.remove')}
                      size="sm"
                      variant="ghost"
                      zIndex={2}
                      onClick={() => handleDelete(role.id)}
                      icon={<DeleteIcon size={18} />}
                    />
                  }
                >
                  {role.name}
                </ListItemWithButtons>
              ))
            )}
          </ModalBody>

          <ModalFooter justifyContent="center">
            <Button leftIcon={<CreateIcon />} onClick={createModal.onOpen}>
              {t('BaseRolesModal.create')}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {createModal.isOpen && (
        <BaseRoleCreateModal
          isOpen
          onClose={createModal.onClose}
          onCreate={(id) => handleEdit(id)}
        />
      )}

      {editModal.isOpen && role && (
        <RoleEditModal role={role} isOpen onClose={editModal.onClose} />
      )}

      {deleteModal.isOpen && role && (
        <RoleDeleteModal role={role} isOpen onClose={deleteModal.onClose} />
      )}
    </>
  )
}
