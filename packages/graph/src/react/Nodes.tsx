import React, { memo } from 'react'
import { CirclesGraph } from '../core/CirclesGraph'
import settings from '../settings'
import { NodeType } from '../types'
import { useGraphSelectedCircleId } from './hooks/useGraphSelectedCircleId'
import { useVisibleNodes } from './hooks/useVisibleNodes'
import CircleElement from './nodes/CircleElement'
import MemberElement from './nodes/MemberElement'

interface Props {
  graph: CirclesGraph
}

export default memo(function Nodes({ graph }: Props) {
  const { nodes, levelHiddenIds } = useVisibleNodes(graph)
  const selectedCircleId = useGraphSelectedCircleId(graph)

  // Mount leaders avatars only when they can be visible (zoom scale near 1),
  // like members: prevents loading hundreds of images at once on page load
  const showLeaders =
    graph.showAllNodes ||
    graph.zoomTransform.k * settings.culling.memberScaleMargin > 1

  return nodes.map((node) => {
    const selected = selectedCircleId === node.data.id
    const levelHidden = levelHiddenIds.has(node.data.id)
    return node.data.type === NodeType.Circle ? (
      <CircleElement
        key={node.data.id}
        node={node}
        selected={selected}
        levelHidden={levelHidden}
        showLeaders={showLeaders}
      />
    ) : node.data.type === NodeType.Member ? (
      <MemberElement key={node.data.id} node={node} levelHidden={levelHidden} />
    ) : null
  })
})
