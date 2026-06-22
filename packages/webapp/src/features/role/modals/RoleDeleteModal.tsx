import useCreateLog from '@/log/hooks/useCreateLog'
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  AlertDialogProps,
  Button,
  Text,
} from '@chakra-ui/react'
import { RoleSummaryFragment, useArchiveRoleMutation } from '@gql'
import { EntityChangeType, LogType } from '@rolebase/shared/model/log'
import React, { useRef } from 'react'
import { Trans, useTranslation } from 'react-i18next'

interface Props
  extends Omit<AlertDialogProps, 'children' | 'leastDestructiveRef'> {
  role: RoleSummaryFragment
  onDelete?(): void
}

export default function RoleDeleteModal({
  role,
  onDelete,
  ...alertProps
}: Props) {
  const { t } = useTranslation()
  const [archiveRole] = useArchiveRoleMutation()
  const createLog = useCreateLog()
  const cancelRef = useRef<HTMLButtonElement>(null)

  const handleDelete = async () => {
    if (!role) return
    const { data } = await archiveRole({
      variables: { id: role.id, archivedAt: new Date().toISOString() },
    })
    onDelete?.()
    alertProps.onClose()

    // Use the DB-returned value (timestamptz "...+00:00"), not the "...Z" input,
    // so "data changed since" comparisons stay accurate.
    const archivedAt = data?.update_role_by_pk?.archivedAt
    if (!archivedAt) return

    // Log change
    createLog({
      display: {
        type: LogType.RoleArchive,
        id: role.id,
        name: role.name,
      },
      changes: {
        roles: [
          {
            type: EntityChangeType.Update,
            id: role.id,
            prevData: { archivedAt: null },
            newData: { archivedAt },
          },
        ],
      },
    })
  }

  if (!role) return null

  return (
    <AlertDialog {...alertProps} leastDestructiveRef={cancelRef}>
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader>{t('RoleDeleteModal.heading')}</AlertDialogHeader>

          <AlertDialogBody>
            <Text>
              <Trans
                i18nKey="RoleDeleteModal.info"
                values={{ name: role.name }}
                components={{ b: <strong /> }}
              />
            </Text>
          </AlertDialogBody>

          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={alertProps.onClose}>
              {t('common.cancel')}
            </Button>
            <Button colorScheme="red" onClick={handleDelete} ml={3}>
              {t('common.delete')}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  )
}
