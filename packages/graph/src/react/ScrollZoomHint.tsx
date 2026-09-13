import React, { memo, useEffect, useState } from 'react'
import { Graph } from '../core/Graph'
import { useMediaQuery } from './hooks/useMediaQuery'

// How long the hint stays after the last wheel event
const hideDelay = 1200

interface Props {
  graph: Graph
  label: string
}

// Over a scrollable graph, the wheel scrolls the page: tell the reader how to
// zoom as soon as they try. A touch screen needs no hint, a pinch just works.
export default memo(function ScrollZoomHint({ graph, label }: Props) {
  const pointer = useMediaQuery('(hover: hover) and (pointer: fine)')
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!pointer) return
    let timeout: ReturnType<typeof setTimeout> | undefined
    const show = () => {
      setVisible(true)
      clearTimeout(timeout)
      timeout = setTimeout(() => setVisible(false), hideDelay)
    }
    // Zooming means the reader got it
    const hide = () => {
      clearTimeout(timeout)
      setVisible(false)
    }
    graph.on('wheelScroll', show)
    graph.on('zoomScale', hide)
    return () => {
      clearTimeout(timeout)
      graph.off('wheelScroll', show)
      graph.off('zoomScale', hide)
    }
  }, [graph, pointer])

  if (!pointer) return null
  return (
    <div
      className={`rb-graph-scroll-hint${visible ? ' visible' : ''}`}
      aria-hidden
    >
      {label}
    </div>
  )
})
