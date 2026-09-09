import React, { memo } from 'react'
import { CirclesGraph } from '../core/CirclesGraph'
import TreeLinks from './TreeLinks'
import { useVisibleNodes } from './hooks/useVisibleNodes'

interface Props {
  graph: CirclesGraph
}

// Edges of the hierarchical views, bound to the culling pass
export default memo(function GraphTreeLinks({ graph }: Props) {
  const { links } = useVisibleNodes(graph)

  return (
    <TreeLinks
      links={links}
      bounds={graph.layoutBounds}
      movingIds={graph.movingLinkIds}
    />
  )
})
