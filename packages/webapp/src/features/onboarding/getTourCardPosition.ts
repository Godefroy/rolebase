import { TourTargetRect } from './hooks/useTourTargetRect'

interface Size {
  width: number
  height: number
}

// Space between the target and the card, and kept along the viewport edges
const GAP = 16
const MARGIN = 16

const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(value, max))

// Place a tour card next to its target: on the left first (the panel targets
// sit on the right of the screen), else on the right, below or above. A target
// too big to sit beside (the org's circle filling the screen), or no target at
// all, puts the card at the bottom of the screen.
export function getTourCardPosition(
  rect: TourTargetRect | undefined,
  card: Size,
  viewport: Size
): { left: number; top: number } {
  const fallback = {
    left: (viewport.width - card.width) / 2,
    top: viewport.height - card.height - 2 * MARGIN,
  }
  if (!rect) return fallback

  const top = clamp(
    rect.top + rect.height / 2 - card.height / 2,
    MARGIN,
    viewport.height - card.height - MARGIN
  )
  const left = clamp(
    rect.left + rect.width / 2 - card.width / 2,
    MARGIN,
    viewport.width - card.width - MARGIN
  )
  const right = rect.left + rect.width
  const bottom = rect.top + rect.height

  if (rect.left - GAP - card.width >= MARGIN) {
    return { left: rect.left - GAP - card.width, top }
  }
  if (right + GAP + card.width <= viewport.width - MARGIN) {
    return { left: right + GAP, top }
  }
  if (bottom + GAP + card.height <= viewport.height - MARGIN) {
    return { left, top: bottom + GAP }
  }
  if (rect.top - GAP - card.height >= MARGIN) {
    return { left, top: rect.top - GAP - card.height }
  }
  return fallback
}
