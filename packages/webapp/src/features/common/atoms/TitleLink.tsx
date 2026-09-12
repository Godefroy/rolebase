import { Link, LinkProps } from '@chakra-ui/react'
import React, { useCallback } from 'react'

interface Props extends LinkProps {
  children: React.ReactNode
}

// Clickable title shown inside a Heading. Highlights with a background on hover
// (instead of an underline) and uses compensating negative margins so the
// padding does not shift surrounding layout.
export default function TitleLink({ children, onClick, ...linkProps }: Props) {
  // A title that only opens a modal has no destination (href="#"): keep the
  // browser from navigating to the hash
  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLAnchorElement>) => {
      if (linkProps.href === '#') event.preventDefault()
      onClick?.(event)
    },
    [linkProps.href, onClick]
  )

  return (
    <Link
      display="inline-block"
      mx={-2}
      my={-1}
      px={2}
      py={1}
      borderRadius="md"
      _hover={{ bg: 'bgItemHover', textDecoration: 'none' }}
      onClick={handleClick}
      {...linkProps}
    >
      {children}
    </Link>
  )
}
