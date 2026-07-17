import { MenuItem, MenuItemProps } from '@chakra-ui/react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { CopyIcon } from 'src/icons'

export default function DuplicateMenuItem(props: MenuItemProps) {
  const { t } = useTranslation()
  return (
    <MenuItem icon={<CopyIcon size={20} />} {...props}>
      {t('common.duplicate')}
    </MenuItem>
  )
}
