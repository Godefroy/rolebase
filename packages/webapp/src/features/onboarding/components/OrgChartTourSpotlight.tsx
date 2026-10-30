import { Box, keyframes } from '@chakra-ui/react'
import React from 'react'
import { TourTargetRect } from '../hooks/useTourTargetRect'
import { TOUR_FADE_MS } from '../orgChartTourTiming'

interface Props {
  rect: TourTargetRect
  isVisible: boolean
}

// Room left around the target inside the spotlight
const PADDING = 6

const pulse = keyframes`
  0%, 100% { outline-offset: 0; }
  50% { outline-offset: 4px; }
`

// Dims the screen around a tour target with a ring on it. Clicks go through:
// the target, and the rest of the org chart, stay usable.
export default function OrgChartTourSpotlight({ rect, isVisible }: Props) {
  return (
    <Box
      position="fixed"
      zIndex={1450}
      left={`${rect.left - PADDING}px`}
      top={`${rect.top - PADDING}px`}
      w={`${rect.width + PADDING * 2}px`}
      h={`${rect.height + PADDING * 2}px`}
      borderRadius={rect.round ? '50%' : 'lg'}
      boxShadow="0 0 0 9999px rgba(0, 0, 0, 0.45)"
      outline="3px solid"
      outlineColor="yellow.400"
      animation={`${pulse} 1.6s ease-in-out infinite`}
      pointerEvents="none"
      opacity={isVisible ? 1 : 0}
      transition={`opacity ${TOUR_FADE_MS}ms ease-out`}
      aria-hidden
    />
  )
}
