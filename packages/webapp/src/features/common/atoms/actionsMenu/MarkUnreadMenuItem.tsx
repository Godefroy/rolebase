import { MenuItem, MenuItemProps } from '@chakra-ui/react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { MarkUnreadIcon } from 'src/icons'

export default function MarkUnreadMenuItem(props: MenuItemProps) {
  const { t } = useTranslation()
  return (
    <MenuItem icon={<MarkUnreadIcon size={20} />} {...props}>
      {t('common.markUnread')}
    </MenuItem>
  )
}
