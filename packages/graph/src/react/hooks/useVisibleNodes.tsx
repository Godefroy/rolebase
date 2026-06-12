import { useEffect, useState } from 'react'
import { Graph } from '../../core/Graph'
import { VisibleNodes } from '../../types'

// Subscribe to the set of visible nodes (windowing)
export function useVisibleNodes(graph: Graph): VisibleNodes {
  const [visible, setVisible] = useState(graph.visibleNodes)

  useEffect(() => {
    // Catch updates that happened between render and subscription
    setVisible(graph.visibleNodes)
    graph.on('visibleNodes', setVisible)
    return () => {
      graph.off('visibleNodes', setVisible)
    }
  }, [graph])

  return visible
}
