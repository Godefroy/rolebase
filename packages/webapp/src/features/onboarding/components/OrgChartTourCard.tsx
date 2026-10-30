import { Box, useColorMode } from '@chakra-ui/react'
import React, { useLayoutEffect, useRef, useState } from 'react'
import { getTourCardPosition } from '../getTourCardPosition'
import { TourTargetRect } from '../hooks/useTourTargetRect'
import { TOUR_FADE_MS } from '../orgChartTourTiming'

interface Props {
  // Target to stand beside, else the card sits at the bottom of the screen
  rect?: TourTargetRect
  isVisible: boolean
  children: React.ReactNode
}

// Narrower on a phone, keeping a margin on each side
const CARD_WIDTH = 320
const VIEWPORT_MARGIN = 16

// Card of the org chart tour, placed beside the target of the current step
export default function OrgChartTourCard({ rect, isVisible, children }: Props) {
  const { colorMode } = useColorMode()
  const ref = useRef<HTMLDivElement>(null)
  const [height, setHeight] = useState(0)

  useLayoutEffect(() => {
    if (ref.current) setHeight(ref.current.offsetHeight)
  })

  const width = Math.min(CARD_WIDTH, window.innerWidth - VIEWPORT_MARGIN * 2)
  const position = getTourCardPosition(
    rect,
    { width, height },
    { width: window.innerWidth, height: window.innerHeight }
  )

  return (
    <Box
      ref={ref}
      role="dialog"
      aria-live="polite"
      position="fixed"
      zIndex={1460}
      left={`${position.left}px`}
      top={`${position.top}px`}
      w={`${width}px`}
      p={5}
      borderRadius="xl"
      boxShadow="xl"
      bg={colorMode === 'light' ? 'white' : 'gray.800'}
      // Shown once measured, to avoid a jump from the default position
      opacity={isVisible && height ? 1 : 0}
      transform={isVisible && height ? 'none' : 'translateY(6px)'}
      transition={`opacity ${TOUR_FADE_MS}ms ease-out, transform ${TOUR_FADE_MS}ms ease-out`}
      pointerEvents={isVisible ? undefined : 'none'}
    >
      {children}
    </Box>
  )
}
