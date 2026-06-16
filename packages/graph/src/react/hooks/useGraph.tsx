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

  // Keep the event handlers up to date. The graph captures `events` only once
  // at init, but the handlers are rebuilt on every edit (the draft actions
  // close over the latest org data). Without this, every interaction after the
  // first would keep operating on the initial org data — e.g. moving a member a
  // second time would read stale state and silently turn the move into a copy.
  useEffect(() => {
    if (graphRef.current) graphRef.current.params.events = events || {}
  }, [events])

  // Update data, once the graph is instanciated and children
  // components have subscribed to its events
  useEffect(() => {
    graph?.updateData(data)
  }, [graph, data])

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

  // Focus on a circle
  useEffect(() => {
    graphRef.current?.selectCircle(selectedCircleId)
  }, [selectedCircleId])

  return graph
}
