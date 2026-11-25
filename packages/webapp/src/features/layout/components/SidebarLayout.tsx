import { Box, Flex } from '@chakra-ui/react'
import React, { useContext, useEffect, useState } from 'react'
import { useLocation } from 'react-router'
import { SidebarContext, sidebarTransitionMs } from '../contexts/SidebarContext'
import SidebarResizeHandle from './SidebarResizeHandle'

interface Props {
  children: React.ReactNode
}

export default function SidebarLayout({ children }: Props) {
  // Get Sidebar context
  const context = useContext(SidebarContext)
  if (!context) {
    throw new Error('SidebarContext not found in Sidebar')
  }
  const {
    isMobile,
    expand,
    collapsed,
    animating,
    compact,
    sidebarWidth,
    expandedWidth,
    height,
    setWidth,
  } = context
  const [resizing, setResizing] = useState(false)

  // Close menu (mobile) on location change
  const location = useLocation()
  useEffect(() => {
    expand.onClose()
  }, [location.pathname])

  return (
    <Box
      position="fixed"
      display="flex"
      flexDirection="column"
      alignItems="stretch"
      top={0}
      bottom={0}
      left={0}
      zIndex={1000}
      w={isMobile ? '100%' : `${sidebarWidth}px`}
      // Clipped during the transition only: menus open outside the sidebar
      overflowX={animating ? 'hidden' : undefined}
      h={isMobile && !expand.isOpen ? height + 1 : undefined}
      transition={
        !resizing ? `width ${sidebarTransitionMs}ms ease-in-out` : 'none'
      }
      bg="menulight"
      _dark={{ bg: 'menudark' }}
      sx={{
        '@media print': {
          display: 'none',
        },
      }}
    >
      {!isMobile && !collapsed && (
        <SidebarResizeHandle
          width={expandedWidth}
          onResizing={setResizing}
          onWidthChange={setWidth}
        />
      )}

      {/* Full width content while the sidebar animates, clipped instead of
          reflowed */}
      <Flex
        flex={1}
        minH={0}
        direction="column"
        w={isMobile || compact ? '100%' : `${expandedWidth}px`}
        flexShrink={0}
      >
        {children}
      </Flex>
    </Box>
  )
}
