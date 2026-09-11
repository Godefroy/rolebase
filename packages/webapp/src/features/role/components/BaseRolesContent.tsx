import ListItemWithButtons from '@/common/atoms/ListItemWithButtons'
import PanelLayout from '@/common/atoms/PanelLayout'
import useOrgBaseRoles from '@/org/hooks/useOrgBaseRoles'
import {
  Alert,
  AlertDescription,
  AlertIcon,
  Button,
  IconButton,
  Text,
  useDisclosure,
} from '@chakra-ui/react'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { CreateIcon, DeleteIcon } from 'src/icons'
import BaseRoleCreateModal from '../modals/BaseRoleCreateModal'
import RoleDeleteModal from '../modals/RoleDeleteModal'
import RoleEditModal from '../modals/RoleEditModal'

interface Props {
  changeTitle?: boolean
  flowHeight?: boolean
  onClose?: () => void
}

// Base roles of the organization, as a panel of the org chart page.
export default function BaseRolesContent(panelProps: Props) {
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
    <PanelLayout title={t('BaseRolesPanel.heading')} {...panelProps}>
      <Alert status="info" mb={5}>
        <AlertIcon />
        <AlertDescription>{t('BaseRolesPanel.info')}</AlertDescription>
      </Alert>

      {!roles?.length ? (
        <Text fontStyle="italic">{t('BaseRolesPanel.empty')}</Text>
      ) : (
        roles.map((role) => (
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

      <Button mt={5} leftIcon={<CreateIcon />} onClick={createModal.onOpen}>
        {t('BaseRolesPanel.create')}
      </Button>

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
    </PanelLayout>
  )
}
