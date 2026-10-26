import {
  Drawer,
  DrawerCloseButton,
  DrawerContent,
  DrawerOverlay,
} from '@chakra-ui/react'
import React from 'react'

interface Props {
  isOpen: boolean
  onClose(): void
  children: React.ReactNode
}

// Side panel showing an org or a user of the admin
export default function AdminDrawer({ isOpen, onClose, children }: Props) {
  return (
    <Drawer isOpen={isOpen} placement="right" size="md" onClose={onClose}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        {children}
      </DrawerContent>
    </Drawer>
  )
}
