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
  // Rendered inside an EnterGroup wrapper (see NodeElement)
  inEnterGroup?: boolean
  // Temporarily hidden during a select-relayout animation (see NodeElement)
  hidden?: boolean
}

// Memoized: a culling pass only re-renders changed elements
export default memo(function MemberElement({
  node,
  levelHidden,
  inEnterGroup,
  hidden,
}: Props) {
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
      inEnterGroup={inEnterGroup}
      hidden={hidden}
      className="member"
      onClick={handleClick}
    >
      {node.data.picture && !inEnterGroup && (
        // <img> (not a background-image) so the platform decodes it
        // asynchronously and can evict it when off-screen, bounding image
        // memory on mobile. Resized: full-resolution photos decode to
        // hundreds of MB.
        // Skipped during the enter animation: an <img> scaled by the group
        // wrapper would be promoted to its own layer instead of painting into
        // the group. It appears when the node hands off to flat rendering.
        <img
          className="member-image"
          src={getResizedImageUrl(node.data.picture, AVATAR_GRAPH_WIDTH)}
          alt=""
          decoding="async"
          draggable={false}
        />
      )}
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
