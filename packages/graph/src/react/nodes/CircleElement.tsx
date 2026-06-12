import React, { memo } from 'react'
import { NodeData } from '../../types'
import { useGraphRenderContext } from '../GraphRenderContext'
import CircleLeadersElement from './CircleLeadersElement'
import NodeElement from './NodeElement'

interface Props {
  node: NodeData
  selected?: boolean
  levelHidden?: boolean
  // Mount leaders avatars (computed at culling time, like members
  // visibility): prevents loading hundreds of images at once on page load
  showLeaders?: boolean
}

// Memoized: a culling pass only re-renders changed elements
export default memo(function CircleElement({
  node,
  selected,
  levelHidden,
  showLeaders = true,
}: Props) {
  const { events } = useGraphRenderContext()
  const { onCircleClick } = events

  return (
    <NodeElement
      node={node}
      selected={selected}
      levelHidden={levelHidden}
      onClick={
        onCircleClick
          ? () => {
              if (!node.data.entityId) return
              // Pass parentId if this is an invited circle (id contains underscore)
              const parentId =
                node.data.id.indexOf('_') !== -1
                  ? node.data.parentId
                  : undefined
              onCircleClick(node.data.entityId, parentId ?? undefined)
            }
          : undefined
      }
    >
      {node.data.participants && showLeaders && (
        <CircleLeadersElement node={node} />
      )}
    </NodeElement>
  )
})
