import React, { memo } from 'react'
import { CirclesGraph } from '../core/CirclesGraph'
import { useVisibleNodes } from './hooks/useVisibleNodes'
import CircleTitleElement from './nodes/CircleTitleElement'

interface Props {
  graph: CirclesGraph
}

export default memo(function CirclesTitles({ graph }: Props) {
  const { titles } = useVisibleNodes(graph)

  return titles.map((node) => (
    <CircleTitleElement key={node.data.id} node={node} />
  ))
})
