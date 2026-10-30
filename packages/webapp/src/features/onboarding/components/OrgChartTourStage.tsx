import { Portal } from '@chakra-ui/react'
import React, { useEffect, useRef, useState } from 'react'
import { TourTargetRect } from '../hooks/useTourTargetRect'
import { TOUR_FADE_MS } from '../orgChartTourTiming'
import OrgChartTourCard from './OrgChartTourCard'
import OrgChartTourSpotlight from './OrgChartTourSpotlight'

interface Props {
  // Identifies what is shown (step and target): a new key fades the previous
  // card out before showing the new one. Undefined hides the tour.
  stepKey?: string
  rect?: TourTargetRect
  // The step points at something: wait for it to be on screen
  hasTarget: boolean
  children: React.ReactNode
}

// A target that never shows (a closed panel) leaves the card at the bottom
const TARGET_WAIT_MS = 1500
// Time the target must stay still before the card shows beside it
const TARGET_SETTLE_MS = 150

// Shows the tour card and its spotlight, one step at a time: the previous step
// fades out as it was (content and position frozen), then the next one fades
// in once its target is on screen.
export default function OrgChartTourStage({
  stepKey,
  rect,
  hasTarget,
  children,
}: Props) {
  const [shownKey, setShownKey] = useState<string>()
  const [visible, setVisible] = useState(false)
  const isCurrent = !!stepKey && shownKey === stepKey

  // What the leaving step showed, kept during its fade out
  const frozen = useRef<{ children: React.ReactNode; rect?: TourTargetRect }>()
  if (isCurrent) frozen.current = { children, rect }

  // Another step: fade the shown one out, then switch
  useEffect(() => {
    if (stepKey === shownKey) return
    setVisible(false)
    const timeout = setTimeout(
      () => {
        if (!stepKey) frozen.current = undefined
        setShownKey(stepKey)
      },
      shownKey ? TOUR_FADE_MS : 0
    )
    return () => clearTimeout(timeout)
  }, [stepKey])

  // Fade in once the target is there and settled (a panel sliding in, its
  // content laying out), or after a while without it
  useEffect(() => {
    if (!isCurrent || visible) return
    if (!hasTarget) {
      setVisible(true)
      return
    }
    const timeout = setTimeout(
      () => setVisible(true),
      rect ? TARGET_SETTLE_MS : TARGET_WAIT_MS
    )
    return () => clearTimeout(timeout)
  }, [
    isCurrent,
    visible,
    hasTarget,
    rect?.left,
    rect?.top,
    rect?.width,
    rect?.height,
  ])

  const shown = isCurrent ? { children, rect } : frozen.current
  if (!shown) return null

  return (
    <Portal>
      {shown.rect && (
        <OrgChartTourSpotlight rect={shown.rect} isVisible={visible} />
      )}
      <OrgChartTourCard rect={shown.rect} isVisible={visible}>
        {shown.children}
      </OrgChartTourCard>
    </Portal>
  )
}
