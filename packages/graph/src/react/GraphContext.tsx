import React, { createContext, useEffect, useRef, useState } from 'react'
import { Graph } from '../core/Graph'

interface GraphContextValue {
  graph: Graph<any> | undefined
  setGraph(graph: Graph<any> | undefined): void
}

export const GraphContext = createContext<GraphContextValue | undefined>(
  undefined
)

interface GraphProviderProps {
  children: React.ReactNode
}

export function GraphProvider({ children }: GraphProviderProps) {
  const [graph, setGraph] = useState<Graph<any> | undefined>()
  const value = useRef({
    graph,
    setGraph,
  })

  useEffect(() => {
    value.current.graph = graph
  }, [graph])

  return (
    <GraphContext.Provider value={value.current}>
      {children}
    </GraphContext.Provider>
  )
}
