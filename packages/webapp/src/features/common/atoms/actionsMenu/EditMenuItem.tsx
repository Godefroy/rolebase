import { MenuItem, MenuItemProps } from '@chakra-ui/react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { EditIcon } from 'src/icons'

export default function EditMenuItem(props: MenuItemProps) {
  const { t } = useTranslation()
  return (
    <MenuItem icon={<EditIcon size={20} />} {...props}>
      {t('common.edit')}
    </MenuItem>
  )
}
