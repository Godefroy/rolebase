import { MenuItem, MenuItemProps } from '@chakra-ui/react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { ArchiveIcon } from 'src/icons'

export default function ArchiveMenuItem(props: MenuItemProps) {
  const { t } = useTranslation()
  return (
    <MenuItem icon={<ArchiveIcon size={20} />} {...props}>
      {t('common.archive')}
    </MenuItem>
  )
}
