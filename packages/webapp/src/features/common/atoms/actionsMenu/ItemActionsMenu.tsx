import { Box } from '@chakra-ui/react'
import React, { ReactNode, SyntheticEvent } from 'react'
import ActionsMenu from './ActionsMenu'

interface Props {
  // Menu items, the same ones as the item's content view menu
  children: ReactNode
  onOpen?(): void
  onClose?(): void
}

// Keep clicks and keys on the menu (and its portal) from reaching the card,
// which would open the item
const stopPropagation = (event: SyntheticEvent) => event.stopPropagation()

// "..." menu in the top-right corner of a list card. The card shows it on
// hover and focus (always on touch screens), see itemCardProps.
export default function ItemActionsMenu({ children, onOpen, onClose }: Props) {
  return (
    <Box
      className="item-actions-menu"
      position="relative"
      zIndex={2}
      my={-1}
      onClick={stopPropagation}
      onKeyDown={stopPropagation}
      onMouseDown={stopPropagation}
      onPointerDown={stopPropagation}
      // Clicks land on the button rather than its SVG icon: the drag and drop
      // library only recognizes HTML elements as interactive (no drag start)
      sx={{ '& svg': { pointerEvents: 'none' } }}
    >
      <ActionsMenu size="xs" onOpen={onOpen} onClose={onClose}>
        {children}
      </ActionsMenu>
    </Box>
  )
}
