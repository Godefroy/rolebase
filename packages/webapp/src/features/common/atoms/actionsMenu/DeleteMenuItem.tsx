import { MenuItem, MenuItemProps } from '@chakra-ui/react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { DeleteIcon } from 'src/icons'

export default function DeleteMenuItem(props: MenuItemProps) {
  const { t } = useTranslation()
  return (
    <MenuItem icon={<DeleteIcon size={20} />} {...props}>
      {t('common.delete')}
    </MenuItem>
  )
}
