import React, { memo } from 'react'
import { CirclesGraph } from '../core/CirclesGraph'
import settings from '../settings'
import { NodeData, NodeType } from '../types'
import EnterGroup from './EnterGroup'
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
  const enteringIds = graph.enteringIds
  const repositionedIds = graph.repositionedIds

  // Mount leaders avatars only when they can be visible (zoom scale near 1),
  // like members: prevents loading hundreds of images at once on page load
  const showLeaders =
    graph.showAllNodes ||
    graph.zoomTransform.k * settings.culling.memberScaleMargin > 1

  // Split entering nodes (added by the last data update) from the rest, and
  // group them by their visual parent. Each group is animated as a single
  // composited layer by EnterGroup, instead of one GPU layer per node.
  const flat: NodeData[] = []
  const enterGroups = new Map<string, { parent: NodeData; nodes: NodeData[] }>()
  for (const node of nodes) {
    const enterParent =
      node.data.type === NodeType.Member ? node.parent?.parent : node.parent
    if (enteringIds.has(node.data.id) && enterParent) {
      let group = enterGroups.get(enterParent.data.id)
      if (!group) {
        group = { parent: enterParent, nodes: [] }
        enterGroups.set(enterParent.data.id, group)
      }
      group.nodes.push(node)
    } else {
      flat.push(node)
    }
  }

  return (
    <>
      {flat.map((node) => {
        const selected = selectedCircleId === node.data.id
        const levelHidden = levelHiddenIds.has(node.data.id)
        // Hide nodes that are moving during a select-relayout (except the
        // focused circle): they would each promote a GPU layer while
        // transitioning. They reappear at their final position once the
        // animation ends (graph clears repositionedIds).
        const hidden = !selected && repositionedIds.has(node.data.id)
        return node.data.type === NodeType.Circle ? (
          <CircleElement
            key={node.data.id}
            node={node}
            selected={selected}
            levelHidden={levelHidden}
            showLeaders={showLeaders}
            hidden={hidden}
          />
        ) : node.data.type === NodeType.Member ? (
          <MemberElement
            key={node.data.id}
            node={node}
            levelHidden={levelHidden}
            hidden={hidden}
          />
        ) : null
      })}
      {Array.from(enterGroups.values()).map((group) => (
        <EnterGroup
          key={group.parent.data.id}
          parent={group.parent}
          nodes={group.nodes}
          levelHiddenIds={levelHiddenIds}
        />
      ))}
    </>
  )
})
