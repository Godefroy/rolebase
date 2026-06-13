import React from 'react'
import { CirclesGraph } from '../core/CirclesGraph'
import { useGraphZoom } from './hooks/useGraphZoom'

interface Props {
  graph: CirclesGraph
  children: React.ReactNode
}

export function Panzoom({ graph, children }: Props) {
  const transform = useGraphZoom(graph)

  return (
    <div
      className="rb-graph-panzoom"
      style={
        {
          transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.k})`,
          '--zoom-scale': transform.k.toString(),
          // Discrete (0/1) leader-avatar visibility, flipped only when the zoom
          // scale crosses 1. Leaders read this instead of --zoom-scale for
          // their opacity: --zoom-scale changes every frame, so deriving
          // opacity from it would re-evaluate and GPU-composite every leader on
          // each frame while crossing scale 1. This variable only changes at
          // the threshold, so they stay un-composited during the gesture.
          '--leaders-opacity': transform.k > 1 ? '1' : '0',
        } as React.CSSProperties
      }
    >
      {children}
    </div>
  )
}
