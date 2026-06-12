import { useContext, useEffect, useRef, useState } from 'react'
import { Graph } from '../../core/Graph'
import {
  GraphColorMode,
  GraphEvents,
  GraphParams,
  Position,
  ZoomFocusCircleScale,
} from '../../types'
import { GraphContext } from '../GraphContext'

export interface GraphProps<Data, TGraph extends Graph<Data>> {
  init(params: GraphParams): TGraph
  data: Data
  events?: GraphEvents
  width: number
  height: number
  colorMode: GraphColorMode
  focusCrop?: Position
  focusCircleScale?: ZoomFocusCircleScale
  selectedCircleId?: string
  panzoomDisabled?: boolean
  // Show members and deep circles at any zoom scale (e.g. export)
  showAllNodes?: boolean
  onReady?(): void
}

export default function useGraph<Data, TGraph extends Graph<Data>>({
  init,
  data,
  events,
  width,
  height,
  colorMode,
  focusCrop,
  focusCircleScale,
  selectedCircleId,
  panzoomDisabled,
  showAllNodes,
  onReady,
}: GraphProps<Data, TGraph>) {
  const graphContext = useContext(GraphContext)

  // Viz
  const [graph, setGraph] = useState<TGraph>()
  const graphRef = useRef<TGraph>()

  // Instanciate graph
  useEffect(() => {
    const params: GraphParams = {
      width,
      height,
      colorMode,
      focusCrop,
      focusCircleScale,
      zoomDisabled: panzoomDisabled,
      showAllNodes,
      events: events || {},
    }
    const graph = init(params)
    graphRef.current = graph
    setGraph(graph)
    graphContext?.setGraph(graph)
    onReady?.()
  }, [])

  // Update data
  useEffect(() => {
    graphRef.current?.updateData(data)
  }, [data])

  // Update dimensions
  useEffect(() => {
    if (width === 0 || height === 0) return
    graphRef.current?.resize(width, height, focusCrop)
  }, [width, height, focusCrop])

  // Update panzoom disabled state
  useEffect(() => {
    const graph = graphRef.current
    if (!graph) return
    graph.zoomDisabled = panzoomDisabled || false
  }, [panzoomDisabled])

  // Update nodes visibility
  useEffect(() => {
    const graph = graphRef.current
    if (!graph || graph.showAllNodes === (showAllNodes || false)) return
    graph.showAllNodes = showAllNodes || false
    graph.cull()
  }, [showAllNodes])

  // Unmount
  useEffect(
    () => () => {
      graphRef.current?.destroy()
      graphContext?.setGraph(undefined)
    },
    []
  )

  // Re-apply data after graph is instanciated
  useEffect(() => {
    if (graph?.inputData) {
      graph.updateData(graph.inputData)
    }
  }, [graph])

  // Focus on a circle
  useEffect(() => {
    graphRef.current?.selectCircle(selectedCircleId)
  }, [selectedCircleId])

  return graph
}
