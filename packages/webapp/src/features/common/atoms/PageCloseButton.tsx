import { IconButton } from '@chakra-ui/react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import CloseIcon from './CloseIcon'

interface Props {
  onClick(): void
}

// Close button of a detail shown in a page (outside a modal)
export default function PageCloseButton({ onClick }: Props) {
  const { t } = useTranslation()

  return (
    <IconButton
      aria-label={t('common.close')}
      icon={<CloseIcon width="12px" height="12px" />}
      variant="ghost"
      size="sm"
      onClick={onClick}
    />
  )
}
