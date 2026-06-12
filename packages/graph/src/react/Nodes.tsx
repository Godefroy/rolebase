import React, { memo } from 'react'
import { CirclesGraph } from '../core/CirclesGraph'
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

  return nodes.map((node) => {
    const selected = selectedCircleId === node.data.id
    const levelHidden = levelHiddenIds.has(node.data.id)
    return node.data.type === NodeType.Circle ? (
      <CircleElement
        key={node.data.id}
        node={node}
        selected={selected}
        levelHidden={levelHidden}
      />
    ) : node.data.type === NodeType.Member ? (
      <MemberElement key={node.data.id} node={node} levelHidden={levelHidden} />
    ) : null
  })
})
