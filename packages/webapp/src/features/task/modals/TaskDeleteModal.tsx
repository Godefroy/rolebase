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
import { TaskFragment, useArchiveTaskMutation } from '@gql'
import React, { useRef } from 'react'
import { Trans, useTranslation } from 'react-i18next'

interface Props
  extends Omit<AlertDialogProps, 'children' | 'leastDestructiveRef'> {
  task: TaskFragment
  onDelete?(): void
}

export default function TaskDeleteModal({
  task,
  onDelete,
  ...alertProps
}: Props) {
  const { t } = useTranslation()
  const cancelRef = useRef<HTMLButtonElement>(null)
  const [archiveTask] = useArchiveTaskMutation()

  const handleDelete = async () => {
    await archiveTask({ variables: { id: task.id, archivedAt: new Date().toISOString() } })
    onDelete?.()
    alertProps.onClose()
  }

  return (
    <AlertDialog {...alertProps} leastDestructiveRef={cancelRef}>
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader>{t('TaskDeleteModal.heading')}</AlertDialogHeader>

          <AlertDialogBody>
            <Text>
              <Trans
                i18nKey="TaskDeleteModal.info"
                values={{ name: task.title }}
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
