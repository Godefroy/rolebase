import React, { memo, useMemo } from 'react'
import {
  AVATAR_GRAPH_WIDTH,
  getResizedImageUrl,
} from '@rolebase/shared/helpers/getResizedImageUrl'
import { NodeData } from '../../types'
import { useGraphRenderContext } from '../GraphRenderContext'
import NodeElement from './NodeElement'
import { nodeSize } from '../styles'

interface Props {
  node: NodeData
  levelHidden?: boolean
}

// Memoized: a culling pass only re-renders changed elements
export default memo(function MemberElement({ node, levelHidden }: Props) {
  const { events } = useGraphRenderContext()

  // Click
  const { onMemberClick } = events
  const handleClick = onMemberClick
    ? () =>
        node.data.parentId &&
        node.data.entityId &&
        onMemberClick?.(node.data.parentId, node.data.entityId)
    : undefined

  // Name
  const firstname = useMemo(
    () => node.data.name.replace(/ .*$/, ''),
    [node.data.name]
  )

  return (
    <NodeElement
      node={node}
      levelHidden={levelHidden}
      className="member"
      style={{
        backgroundImage: node.data.picture
          ? // Resized: full-resolution photos decode to hundreds of MB
            `url(${getResizedImageUrl(node.data.picture, AVATAR_GRAPH_WIDTH)})`
          : undefined,
      }}
      onClick={handleClick}
    >
      <span
        className="member-name"
        style={{
          translate: `0px ${nodeSize / 2 - 35}px`,
        }}
      >
        {firstname}
      </span>
    </NodeElement>
  )
})
