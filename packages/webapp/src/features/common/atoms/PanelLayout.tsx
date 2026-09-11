import { Box, BoxProps, Flex, Heading, Spacer } from '@chakra-ui/react'
import React from 'react'
import ModalCloseStaticButton from './ModalCloseStaticButton'
import { Title } from './Title'

interface Props {
  title: string
  changeTitle?: boolean
  // When true, the content flows to its natural height instead of filling its
  // parent with an inner scroll. Used when the whole page scrolls (mobile/tablet).
  flowHeight?: boolean
  // Override the header close button handler (otherwise closes the parent modal)
  onClose?: () => void
  // Ref on the scrolling body, to use it as an IntersectionObserver root
  bodyRef?: React.RefObject<HTMLDivElement>
  bodyProps?: BoxProps
  children: React.ReactNode
}

// Chrome shared by the panels of the org chart page: a header with the panel
// name and its close button, above a body that scrolls on its own.
export default function PanelLayout({
  title,
  changeTitle,
  flowHeight,
  onClose,
  bodyRef,
  bodyProps,
  children,
}: Props) {
  return (
    <Flex direction="column" h={flowHeight ? undefined : '100%'}>
      {changeTitle && <Title>{title}</Title>}

      <Flex
        alignItems="center"
        pl={6}
        pr={2}
        py={3}
        bg="menulight"
        _dark={{ bg: 'menudark' }}
      >
        <Heading as="h1" size="md" fontWeight="bold">
          {title}
        </Heading>
        <Spacer />
        <ModalCloseStaticButton onClose={onClose} />
      </Flex>

      <Box
        ref={bodyRef}
        flex={flowHeight ? undefined : 1}
        minH={flowHeight ? undefined : 0}
        overflowY={flowHeight ? undefined : 'auto'}
        px={6}
        py={5}
        {...bodyProps}
      >
        {children}
      </Box>
    </Flex>
  )
}
