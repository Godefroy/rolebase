import { IconButton, useModalContext } from '@chakra-ui/react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import CloseIcon from './CloseIcon'

interface Props {
  // Override the close handler (otherwise closes the nearest modal)
  onClose?: () => void
}

export default function ModalCloseStaticButton({ onClose }: Props) {
  const { t } = useTranslation()
  const modal = useModalContext()
  const handleClose = onClose || modal?.onClose

  return (
    <IconButton
      aria-label={t('ModalCloseStaticButton.label')}
      icon={<CloseIcon width="12px" height="12px" />}
      variant="ghost"
      size="sm"
      onClick={handleClose}
    />
  )
}
