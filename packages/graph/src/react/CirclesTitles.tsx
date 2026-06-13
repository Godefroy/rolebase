import React, { memo } from 'react'
import { CirclesGraph } from '../core/CirclesGraph'
import { useVisibleNodes } from './hooks/useVisibleNodes'
import CircleTitleElement from './nodes/CircleTitleElement'

interface Props {
  graph: CirclesGraph
}

export default memo(function CirclesTitles({ graph }: Props) {
  const { titles, titleVisibility, cullScale } = useVisibleNodes(graph)
  const enteringIds = graph.enteringIds
  const repositionedIds = graph.repositionedIds

  return titles.map((node) => (
    <CircleTitleElement
      key={node.data.id}
      node={node}
      visibility={titleVisibility.get(node.data.id)}
      cullScale={cullScale}
      // Hide every title while its node is animating (entering, or moving
      // during a select-relayout, including the focused circle). Each visible
      // title would otherwise promote its own GPU layer while it transitions.
      // Titles reappear when the animation ends (graph clears the flags).
      hidden={
        enteringIds.has(node.data.id) || repositionedIds.has(node.data.id)
      }
    />
  ))
})
