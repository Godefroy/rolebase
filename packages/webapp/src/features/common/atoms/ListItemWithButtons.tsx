import { HStack, LinkBox, LinkBoxProps, LinkOverlay } from '@chakra-ui/react'
import React from 'react'
import { Link as ReachLink } from 'react-router'

interface Props extends LinkBoxProps {
  children: React.ReactNode
  buttons?: React.ReactNode
  onClick(): void
}

export default function ListItemWithButtons({
  children,
  buttons,
  onClick,
  ...linkBoxProps
}: Props) {
  return (
    <LinkBox
      mx={-2}
      px={2}
      py={1}
      display="flex"
      minH="32px"
      alignItems="center"
      role="group"
      _hover={{ bg: 'bgItemHover' }}
      {...linkBoxProps}
    >
      <LinkOverlay
        flex={1}
        to="#"
        as={ReachLink}
        onClick={(event) => {
          event.preventDefault()
          onClick()
        }}
      >
        {children}
      </LinkOverlay>
      {buttons && <HStack spacing={2}>{buttons}</HStack>}
    </LinkBox>
  )
}
