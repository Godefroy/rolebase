import { Box, Menu, MenuButton, MenuList, Portal } from '@chakra-ui/react'
import { PointerPosition } from '@rolebase/graph'
import React, { ReactNode, useState } from 'react'
import { menuListProps } from './menuListProps'

interface Props {
  // Viewport point the menu opens at (a right click)
  anchor: PointerPosition
  // The menu closed: the caller can unmount it
  onClose(): void
  children: ReactNode
}

// Menu opened at a point rather than from a button, for context menus.
// The anchor is an empty element placed at the pointer position.
export default function AnchoredMenu({ anchor, onClose, children }: Props) {
  const [isOpen, setIsOpen] = useState(true)

  const handleClose = () => {
    setIsOpen(false)
    onClose()
  }

  return (
    <Menu isOpen={isOpen} onClose={handleClose} isLazy placement="bottom-start">
      <MenuButton
        as={Box}
        position="fixed"
        left={`${anchor.x}px`}
        top={`${anchor.y}px`}
        w="1px"
        h="1px"
      />

      <Portal>
        <MenuList {...menuListProps}>{children}</MenuList>
      </Portal>
    </Menu>
  )
}
