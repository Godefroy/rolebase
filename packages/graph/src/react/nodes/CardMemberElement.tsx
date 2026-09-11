import {
  AVATAR_GRAPH_WIDTH,
  getResizedImageUrl,
} from '@rolebase/shared/helpers/getResizedImageUrl'
import React, { memo } from 'react'
import settings from '../../settings'
import { NodeData } from '../../types'
import { useGraphRenderContext } from '../GraphRenderContext'
import NodeElement from './NodeElement'

interface Props {
  node: NodeData
  // Temporarily hidden during a select-relayout animation (see NodeElement)
  hidden?: boolean
}

const { memberAvatarSize } = settings.tree

// A member listed inside an org chart card: one row, avatar then name.
// Memoized: a culling pass only re-renders changed elements
export default memo(function CardMemberElement({ node, hidden }: Props) {
  const { events } = useGraphRenderContext()
  const { onMemberClick, onMemberContextMenu } = events

  return (
    <NodeElement
      node={node}
      hidden={hidden}
      className="card-member"
      onClick={
        onMemberClick
          ? () =>
              node.data.parentId &&
              node.data.entityId &&
              onMemberClick(node.data.parentId, node.data.entityId)
          : undefined
      }
      onContextMenu={
        onMemberContextMenu
          ? (event) => {
              if (!node.data.parentId || !node.data.entityId) return
              event.preventDefault()
              onMemberContextMenu(node.data.parentId, node.data.entityId, {
                x: event.clientX,
                y: event.clientY,
              })
            }
          : undefined
      }
    >
      <div
        className="card-member-avatar"
        style={{
          width: `${memberAvatarSize}px`,
          height: `${memberAvatarSize}px`,
        }}
      >
        {node.data.picture ? (
          // <img> (not a background-image) so the platform decodes it
          // asynchronously and can evict it when off-screen, bounding image
          // memory on mobile
          <img
            className="card-member-image"
            src={getResizedImageUrl(node.data.picture, AVATAR_GRAPH_WIDTH)}
            alt=""
            decoding="async"
            draggable={false}
          />
        ) : (
          <span className="card-member-initial">
            {node.data.name[0]?.toUpperCase()}
          </span>
        )}
      </div>

      <span className="card-member-name">{node.data.name}</span>
    </NodeElement>
  )
})
