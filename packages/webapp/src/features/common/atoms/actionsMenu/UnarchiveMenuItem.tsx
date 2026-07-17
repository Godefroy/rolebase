import { MenuItem, MenuItemProps } from '@chakra-ui/react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { RestoreIcon } from 'src/icons'

export default function UnarchiveMenuItem(props: MenuItemProps) {
  const { t } = useTranslation()
  return (
    <MenuItem icon={<RestoreIcon size={20} />} {...props}>
      {t('common.unarchive')}
    </MenuItem>
  )
}
