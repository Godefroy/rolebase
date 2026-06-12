import { Box, keyframes } from '@chakra-ui/react'
import React from 'react'

const shine = keyframes`
  to { background-position-x: -200%; }
`

export function CollabOfflineOverlay() {
  return (
    <Box
      position="absolute"
      top={0}
      left={0}
      right={0}
      bottom={0}
      background="linear-gradient(110deg, rgba(128, 128, 128, 0.05) 8%, rgba(128, 128, 128, 0.15) 28%, rgba(128, 128, 128, 0.05) 33%)"
      backgroundSize="200% 100%"
      animation={`1.5s ${shine} linear infinite`}
    />
  )
}
