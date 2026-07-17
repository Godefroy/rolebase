import { MenuItem, MenuItemProps } from '@chakra-ui/react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { MoveIcon } from 'src/icons'

export default function MoveMenuItem(props: MenuItemProps) {
  const { t } = useTranslation()
  return (
    <MenuItem icon={<MoveIcon size={20} />} {...props}>
      {t('common.move')}
    </MenuItem>
  )
}
