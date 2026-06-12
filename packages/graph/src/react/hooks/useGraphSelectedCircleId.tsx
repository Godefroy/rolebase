import { useEffect, useState } from 'react'
import { Graph } from '../../core/Graph'

export function useGraphSelectedCircleId(graph: Graph) {
  const [selectedCircleId, setSelectedCircleId] = useState(
    graph.selectedCircleId
  )

  useEffect(() => {
    setSelectedCircleId(graph.selectedCircleId)
    graph.on('selectCircle', setSelectedCircleId)
    return () => {
      graph.off('selectCircle', setSelectedCircleId)
    }
  }, [graph])

  return selectedCircleId
}
