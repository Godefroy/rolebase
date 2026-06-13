import {
  Box,
  Modal,
  ModalContextProvider,
  ModalProps,
  useBreakpointValue,
} from '@chakra-ui/react'
import React, { useMemo } from 'react'

export const modalPanelWidth = 450

export default function ModalPanel({
  isOpen,
  onClose,
  children,
  ...props
}: ModalProps) {
  // On desktop (lg+) the panel is a fixed side panel with its own scroll.
  // Below lg it flows inline below the graph so the whole page scrolls as one.
  const isSidePanel = useBreakpointValue({ base: false, lg: true }) ?? false

  // Provide a minimal modal context so close buttons keep working inline,
  // where there is no Chakra Modal wrapper.
  const modalContext = useMemo(
    () =>
      ({ isOpen, onClose }) as unknown as React.ComponentProps<
        typeof ModalContextProvider
      >['value'],
    [isOpen, onClose]
  )

  if (!isSidePanel) {
    return (
      <ModalContextProvider value={modalContext}>
        <Box
          position="relative"
          zIndex={1}
          minH="50vh"
          borderTopWidth="1px"
          bg="white"
          _dark={{ bg: 'gray.900' }}
        >
          {children}
        </Box>
      </ModalContextProvider>
    )
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} {...props}>
      <Box
        position="absolute"
        top={0}
        bottom={0}
        right={0}
        w={`${modalPanelWidth}px`}
        overflowY="auto"
        zIndex={1}
        borderLeftWidth="1px"
        bg="white"
        _dark={{ bg: 'gray.900' }}
      >
        {children}
      </Box>
    </Modal>
  )
}
