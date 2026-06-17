import { Link, LinkProps } from '@chakra-ui/react'
import React from 'react'

interface Props extends LinkProps {
  children: React.ReactNode
}

// Clickable title shown inside a Heading. Highlights with a background on hover
// (instead of an underline) and uses compensating negative margins so the
// padding does not shift surrounding layout.
export default function TitleLink({ children, ...linkProps }: Props) {
  return (
    <Link
      display="inline-block"
      mx={-2}
      my={-1}
      px={2}
      py={1}
      borderRadius="md"
      _hover={{ bg: 'bgItemHover', textDecoration: 'none' }}
      {...linkProps}
    >
      {children}
    </Link>
  )
}
