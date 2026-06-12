import { useEffect, useState } from 'react'
import { Graph } from '../../core/Graph'

export function useGraphZoom(graph: Graph) {
  const [transform, setTransform] = useState(graph.zoomTransform)

  useEffect(() => {
    setTransform(graph.zoomTransform)
    graph.on('zoom', setTransform)
    return () => {
      graph.off('zoom', setTransform)
    }
  }, [graph])

  return transform
}
