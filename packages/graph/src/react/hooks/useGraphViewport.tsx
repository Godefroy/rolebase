import { ZoomTransform } from 'd3'
import { useEffect, useState } from 'react'
import { Graph } from '../../core/Graph'
import { NodeData, Position } from '../../types'

interface Viewport {
  transform: ZoomTransform
  width: number
  height: number
  // What a panel covers of the graph: the visible area is what is left
  focusCrop: Position
  nodes: NodeData[]
}

const readViewport = (graph: Graph): Viewport => ({
  transform: graph.zoomTransform,
  width: graph.width,
  height: graph.height,
  focusCrop: graph.focusCrop,
  nodes: graph.nodes,
})

// Where the view sits over the whole layout: the zoom transform, the size of
// the graph and its nodes. Unlike the culling pass, this is the whole layout,
// so a consumer can draw what is off screen (the minimap).
export function useGraphViewport(graph: Graph): Viewport {
  const [viewport, setViewport] = useState(() => readViewport(graph))

  useEffect(() => {
    const update = () => setViewport(readViewport(graph))
    // Catch updates that happened between render and subscription
    update()
    graph.on('zoom', update)
    graph.on('resize', update)
    graph.on('nodesData', update)
    return () => {
      graph.off('zoom', update)
      graph.off('resize', update)
      graph.off('nodesData', update)
    }
  }, [graph])

  return viewport
}
