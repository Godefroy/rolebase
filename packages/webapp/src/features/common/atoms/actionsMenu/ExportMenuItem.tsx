import { MenuItem, MenuItemProps } from '@chakra-ui/react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { ExportCircleIcon } from 'src/icons'

export default function ExportMenuItem(props: MenuItemProps) {
  const { t } = useTranslation()
  return (
    <MenuItem icon={<ExportCircleIcon size={20} />} {...props}>
      {t('common.export')}
    </MenuItem>
  )
}
