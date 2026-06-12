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
          // Prevent from interacting with members when they are hidden
          '--member-pointer-events': transform.k > 1 ? 'auto' : 'none',
        } as React.CSSProperties
      }
    >
      {children}
    </div>
  )
}
