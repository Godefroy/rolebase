import { GraphContext } from '@/graph/contexts/GraphContext'
import { NodeClientRect } from '@rolebase/graph'
import { useContext, useEffect, useState } from 'react'

// What a tour step points at: a node of the org chart, or an element marked
// with a data-tour attribute
export type TourTarget = { nodeId: string } | { anchor: string }

export type TourTargetRect = NodeClientRect

// Viewport box of a tour target, followed frame by frame: the org chart zooms
// and pans, the side panel slides in, its content scrolls. Undefined while the
// target is not on screen.
export default function useTourTargetRect(target: TourTarget | undefined) {
  const graphContext = useContext(GraphContext)
  const [rect, setRect] = useState<TourTargetRect | undefined>()
  const targetKey = target && JSON.stringify(target)

  useEffect(() => {
    if (!target) {
      setRect(undefined)
      return
    }
    let frame: number
    let last: TourTargetRect | undefined

    const measure = (): TourTargetRect | undefined => {
      if ('nodeId' in target) {
        return graphContext?.graph?.getNodeClientRect(target.nodeId)
      }
      const element = document.querySelector(`[data-tour="${target.anchor}"]`)
      if (!element) return
      const { left, top, width, height } = element.getBoundingClientRect()
      if (width === 0 && height === 0) return
      return { left, top, width, height, round: false }
    }

    const loop = () => {
      const next = measure()
      // Render only when the box actually moved
      if (
        next?.left !== last?.left ||
        next?.top !== last?.top ||
        next?.width !== last?.width ||
        next?.height !== last?.height
      ) {
        last = next
        setRect(next)
      }
      frame = requestAnimationFrame(loop)
    }
    loop()
    return () => cancelAnimationFrame(frame)
  }, [targetKey])

  return rect
}
