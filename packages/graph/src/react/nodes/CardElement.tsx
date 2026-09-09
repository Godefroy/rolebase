import React, { memo } from 'react'
import {
  cardShowsLeaders,
  cardTitleHeight,
  titleLineCount,
} from '../../core/layouts/tree'
import { NodeData } from '../../types'
import { useGraphRenderContext } from '../GraphRenderContext'
import CardLeadersElement from './CardLeadersElement'
import NodeElement from './NodeElement'

interface Props {
  node: NodeData
  selected?: boolean
  // Mount leaders avatars only when they can be visible (see CircleElement)
  showLeaders?: boolean
  // Temporarily hidden during a select-relayout animation (see NodeElement)
  hidden?: boolean
}

// A circle rendered as an org chart card, in the hierarchical views.
// The role name lives in the card, so no separate title element is rendered.
// Memoized: a culling pass only re-renders changed elements
export default memo(function CardElement({
  node,
  selected,
  showLeaders = true,
  hidden,
}: Props) {
  const { events } = useGraphRenderContext()
  const { onCircleClick } = events

  // Invited circles (links) appear as a dashed card under their inviting circle
  const isLink = node.data.id.indexOf('_') !== -1

  return (
    <NodeElement
      node={node}
      selected={selected}
      hidden={hidden}
      className={`card${isLink ? ' card-link' : ''}`}
      onClick={
        onCircleClick
          ? () => {
              if (!node.data.entityId) return
              onCircleClick(
                node.data.entityId,
                isLink ? node.data.parentId ?? undefined : undefined
              )
            }
          : undefined
      }
    >
      <div
        className="card-title"
        style={{ height: `${cardTitleHeight(node.data.name)}px` }}
      >
        {/* Clamped to the line count the layout sized the card for, so a name
            the estimate falls short on ellipsizes instead of overflowing */}
        <span
          className="card-title-text"
          style={
            {
              '--title-lines': titleLineCount(node.data.name),
            } as React.CSSProperties
          }
        >
          {node.data.name}
        </span>
      </div>

      {showLeaders && cardShowsLeaders(node.data) && (
        <CardLeadersElement node={node} />
      )}
    </NodeElement>
  )
})
