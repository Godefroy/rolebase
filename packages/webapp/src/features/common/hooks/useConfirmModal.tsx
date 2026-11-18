import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  ButtonProps,
} from '@chakra-ui/react'
import React, { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

export interface ConfirmModalProps {
  heading: string
  info: string
  buttonColor?: ButtonProps['colorScheme']
  buttonLabel?: string
  onConfirm(): void
  onCancel?(): void
}

export default function useConfirmModal() {
  const { t } = useTranslation()
  const cancelRef = useRef<HTMLButtonElement>(null)
  const [props, setProps] = useState<ConfirmModalProps | undefined>()

  const handleConfirm = () => {
    props?.onConfirm()
    setProps(undefined)
  }

  const handleClose = () => {
    props?.onCancel?.()
    setProps(undefined)
  }

  return {
    confirmElement: props && (
      <AlertDialog isOpen onClose={handleClose} leastDestructiveRef={cancelRef}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader>{props.heading}</AlertDialogHeader>

            <AlertDialogBody>{props.info}</AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={handleClose}>
                {t('common.cancel')}
              </Button>
              <Button
                colorScheme={props.buttonColor}
                ml={3}
                onClick={handleConfirm}
              >
                {props.buttonLabel}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    ),

    confirm: ({
      buttonLabel = t('common.delete'),
      buttonColor = 'red',
      ...props
    }: ConfirmModalProps) => {
      setProps({
        ...props,
        buttonLabel,
        buttonColor,
      })
    },
  }
}
