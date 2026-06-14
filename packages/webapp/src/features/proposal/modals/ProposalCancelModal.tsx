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
import React, { useRef } from 'react'
import { useTranslation } from 'react-i18next'

interface Props
  extends Omit<AlertDialogProps, 'children' | 'leastDestructiveRef'> {
  duplicate: boolean
  onConfirm(): void
}

export default function ProposalCancelModal({
  duplicate,
  onConfirm,
  ...alertProps
}: Props) {
  const { t } = useTranslation()
  const cancelRef = useRef<HTMLButtonElement>(null)

  const handleConfirm = () => {
    onConfirm()
    alertProps.onClose()
  }

  return (
    <AlertDialog {...alertProps} leastDestructiveRef={cancelRef}>
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader>
            {t(
              duplicate
                ? 'ProposalCancelModal.headingDuplicate'
                : 'ProposalCancelModal.heading'
            )}
          </AlertDialogHeader>
          <AlertDialogBody>
            {t(
              duplicate
                ? 'ProposalCancelModal.infoDuplicate'
                : 'ProposalCancelModal.info'
            )}
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={alertProps.onClose}>
              {t('ProposalCancelModal.dismiss')}
            </Button>
            <Button colorScheme="red" ml={3} onClick={handleConfirm}>
              {t(
                duplicate
                  ? 'ProposalCancelModal.confirmDuplicate'
                  : 'ProposalCancelModal.confirm'
              )}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  )
}
