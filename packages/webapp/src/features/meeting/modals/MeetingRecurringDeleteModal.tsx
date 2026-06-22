import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  AlertDialogProps,
  Button,
} from '@chakra-ui/react'
import {
  MeetingRecurringFragment,
  useArchiveMeetingRecurringMutation,
} from '@gql'
import React, { useRef } from 'react'
import { Trans, useTranslation } from 'react-i18next'

interface Props
  extends Omit<AlertDialogProps, 'children' | 'leastDestructiveRef'> {
  meetingRecurring: MeetingRecurringFragment
  onDelete?(): void
}

export default function MeetingRecurringDeleteModal({
  meetingRecurring,
  onDelete,
  ...alertProps
}: Props) {
  const { t } = useTranslation()
  const cancelRef = useRef<HTMLButtonElement>(null)
  const [archiveMeetingRecurring] = useArchiveMeetingRecurringMutation()

  const handleDelete = () => {
    archiveMeetingRecurring({
      variables: {
        id: meetingRecurring.id,
        archivedAt: new Date().toISOString(),
      },
    })
    onDelete?.()
    alertProps.onClose()
  }

  return (
    <AlertDialog {...alertProps} leastDestructiveRef={cancelRef}>
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader>
            {t('MeetingRecurringDeleteModal.heading')}
          </AlertDialogHeader>

          <AlertDialogBody>
            <Trans
              i18nKey="MeetingRecurringDeleteModal.info"
              values={{
                name: meetingRecurring.template.title,
                circle: meetingRecurring.circle.role.name,
              }}
              components={{ b: <strong /> }}
            />
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
