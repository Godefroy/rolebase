import { useEffect, useState } from 'react'
import { Graph } from '../../core/Graph'

// Background color shown behind the graph while moved nodes are hidden during a
// select-relayout animation (the focus circle parent color), or undefined.
export function useRepositioningBg(graph: Graph | undefined) {
  const [color, setColor] = useState<string | undefined>()

  useEffect(() => {
    if (!graph) return
    graph.on('repositioningBg', setColor)
    return () => {
      graph.off('repositioningBg', setColor)
    }
  }, [graph])

  return color
}
