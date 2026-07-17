import { MenuItem, MenuItemProps } from '@chakra-ui/react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { LinkIcon } from 'src/icons'
import useCopyUrl from '../../hooks/useCopyUrl'

interface Props extends Omit<MenuItemProps, 'onClick'> {
  url: string
}

export default function CopyLinkMenuItem({ url, ...props }: Props) {
  const { t } = useTranslation()
  const handleCopyLink = useCopyUrl(url)
  return (
    <MenuItem icon={<LinkIcon size={20} />} onClick={handleCopyLink} {...props}>
      {t('common.copyLink')}
    </MenuItem>
  )
}
