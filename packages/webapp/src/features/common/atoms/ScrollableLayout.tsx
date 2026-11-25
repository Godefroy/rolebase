import { Box, BoxProps, Flex } from '@chakra-ui/react'
import React, { ReactNode, useRef } from 'react'
import useScrollable, {
  ScrollPosition,
  ScrollableContext,
} from '../hooks/useScrollable'

interface Props extends BoxProps {
  header?: ReactNode
  children?: ReactNode
  footer?: ReactNode
  // Content on the beige background instead of the white panel (card lists)
  beigeContent?: boolean
}

const scrollbarWidth = '12px'

export default function ScrollableLayout({
  header,
  children,
  footer,
  beigeContent,
  ...boxProps
}: Props) {
  // Scrollable content
  const topRef = useRef<HTMLDivElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const scrollable = useScrollable()
  const {
    containerRef,
    contentRef,
    isScrollable,
    scrollPosition,
    handleScroll,
  } = scrollable

  const showTopbar = isScrollable && scrollPosition !== ScrollPosition.Top
  const showBottombar = isScrollable && scrollPosition !== ScrollPosition.Bottom

  return (
    <ScrollableContext.Provider value={scrollable}>
      <Box
        borderRadius="lg"
        display="flex"
        flexDirection="column"
        h="100%"
        bg="menulight"
        _dark={{ bg: 'menudark' }}
        sx={{
          '@media print': {
            display: 'block',
            height: 'auto',
          },
        }}
        {...boxProps}
      >
        <Box
          ref={topRef}
          position="relative"
          zIndex={10}
          minH={scrollbarWidth}
          display="flex"
          w="100%"
          py={2}
          px={scrollbarWidth}
          borderBottomWidth={2}
          borderBottomColor={showTopbar ? 'gray.200' : 'transparent'}
          bg="menulight"
          _dark={{
            bg: 'menudark',
            borderBottomColor: showTopbar ? 'gray.600' : 'transparent',
          }}
        >
          {header}
        </Box>

        <Flex
          flex={1}
          ref={containerRef}
          flexDirection="column"
          overflowY="auto"
          sx={{
            '@media print': {
              overflowY: 'visible',
            },
          }}
          onScroll={handleScroll}
        >
          <Box
            ref={contentRef}
            flex={1}
            position="relative"
            borderTopRadius={showTopbar ? 0 : '32px'}
            borderBottomRadius={showBottombar ? 0 : '32px'}
            transition="border-radius 0.1s ease-out"
            bg={beigeContent ? 'menulight' : 'white'}
            _dark={{ bg: beigeContent ? 'menudark' : 'gray.900' }}
          >
            {children}
          </Box>
        </Flex>

        <Box
          ref={bottomRef}
          position="relative"
          zIndex={10}
          minH={scrollbarWidth}
          px={{ base: 0, md: scrollbarWidth }}
          borderTopWidth={2}
          borderTopColor={showBottombar ? 'gray.200' : 'transparent'}
          bg="menulight"
          _dark={{
            bg: 'menudark',
            borderTopColor: showBottombar ? 'gray.600' : 'transparent',
          }}
        >
          {footer}
        </Box>
      </Box>
    </ScrollableContext.Provider>
  )
}
