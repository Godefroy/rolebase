import {
  IconButton,
  IconButtonProps,
  Menu,
  MenuButton,
  MenuList,
  Portal,
} from '@chakra-ui/react'
import React, { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { MoreIcon } from 'src/icons'

interface Props extends Omit<IconButtonProps, 'aria-label' | 'children'> {
  // The menu items to render, composed from the reusable *MenuItem atoms
  // (EditMenuItem, DeleteMenuItem, …) plus any caller-specific MenuItem.
  children: ReactNode
}

export default function ActionsMenu({ children, ...props }: Props) {
  const { t } = useTranslation()

  return (
    <Menu isLazy>
      <MenuButton
        aria-label={t('ActionsMenu.label')}
        as={IconButton}
        icon={<MoreIcon size={20} />}
        variant="ghost"
        size="sm"
        {...props}
      />

      <Portal>
        <MenuList
          fontFamily="body"
          fontSize="1rem"
          fontWeight="normal"
          shadow="lg"
          zIndex={2000}
        >
          {children}
        </MenuList>
      </Portal>
    </Menu>
  )
}
