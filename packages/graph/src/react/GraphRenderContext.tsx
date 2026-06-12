import { createContext, useContext } from 'react'
import { CirclesGraph } from '../core/CirclesGraph'
import { GraphColorMode, GraphEvents } from '../types'

// Rendering context shared by graph elements.
// `graph` is undefined in static rendering (no interactions).
export interface GraphRenderContextValue {
  graph?: CirclesGraph
  colorMode: GraphColorMode
  events: GraphEvents
  isStatic: boolean
}

export const GraphRenderContext = createContext<GraphRenderContextValue>({
  colorMode: 'light',
  events: {},
  isStatic: false,
})

export function useGraphRenderContext() {
  return useContext(GraphRenderContext)
}
