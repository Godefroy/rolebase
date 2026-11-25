import { Link } from '@chakra-ui/react'
import React from 'react'
import { Link as ReachLink } from 'react-router'

interface Props {
  to: string
  children: string
}

// Link to the full list page, below a sidebar list
export default function SidebarSeeAllLink({ to, children }: Props) {
  return (
    <Link
      as={ReachLink}
      to={to}
      display="inline-block"
      mt={1}
      px={1}
      fontSize="sm"
      fontWeight="medium"
      color="gray.500"
      _hover={{ color: 'gray.700', textDecoration: 'none' }}
      _dark={{ color: 'whiteAlpha.600', _hover: { color: 'whiteAlpha.900' } }}
    >
      {children} →
    </Link>
  )
}
