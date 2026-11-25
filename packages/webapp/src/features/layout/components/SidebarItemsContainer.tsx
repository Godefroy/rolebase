import { Box } from '@chakra-ui/react'
import React, { ReactNode } from 'react'

interface Props {
  children: ReactNode
}

// Content below a sidebar link, aligned with its label
export default function SidebarItemsContainer({ children }: Props) {
  return (
    <Box pl="40px" pr={1} pt={0.5} pb={3} fontSize="0.94em">
      {children}
    </Box>
  )
}
