import React, { memo } from 'react'
import { cardTitleHeight, titleLineCount } from '../../core/layouts/tree'
import { NodeData } from '../../types'
import { useGraphRenderContext } from '../GraphRenderContext'
import NodeElement from './NodeElement'

interface Props {
  node: NodeData
  selected?: boolean
  // Temporarily hidden during a select-relayout animation (see NodeElement)
  hidden?: boolean
}

// A circle rendered as an org chart card, in the hierarchical views.
// The role name lives in the card, so no separate title element is rendered.
// Memoized: a culling pass only re-renders changed elements
export default memo(function CardElement({ node, selected, hidden }: Props) {
  const { events } = useGraphRenderContext()
  const { onCircleClick, onCircleContextMenu } = events

  // Invited circles (links) appear as a dashed card under their inviting circle
  const isLink = node.data.id.indexOf('_') !== -1

  // Nameless card listing the members of the role above it: no title block
  const isMembersCard = !!node.data.membersCard

  // Folded card: the sub-roles it holds are left out of the layout, marked by
  // an ellipsis in the gap below the card
  const hiddenChildren = !!node.data.hiddenChildren && !hidden

  // The ellipsis stands for the card, so it answers to the pointer like it
  const { entityId } = node.data
  const parentId = isLink ? node.data.parentId ?? undefined : undefined

  const handleClick =
    onCircleClick && entityId
      ? () => onCircleClick(entityId, parentId)
      : undefined

  const handleContextMenu =
    onCircleContextMenu && entityId
      ? (event: React.MouseEvent) => {
          event.preventDefault()
          onCircleContextMenu(
            entityId,
            { x: event.clientX, y: event.clientY },
            parentId
          )
        }
      : undefined

  return (
    <>
      {/* Placed before the card, which is what lets it outline the card on
          hover (a CSS sibling rule), and drawn below it all the same */}
      {hiddenChildren && (
        <div
          className="card-hidden-children"
          style={{
            translate: `${node.x}px ${node.y + node.h / 2}px`,
            cursor: handleClick ? 'pointer' : undefined,
          }}
          aria-hidden
          onClick={handleClick}
          onContextMenu={handleContextMenu}
        >
          …
        </div>
      )}
      <NodeElement
        node={node}
        selected={selected}
        hidden={hidden}
        className={`card${isLink ? ' card-link' : ''}${
          isMembersCard ? ' card-members' : ''
        }`}
        onClick={handleClick}
        onContextMenu={handleContextMenu}
      >
        {!isMembersCard && (
          <div
            className="card-title"
            style={{ height: `${cardTitleHeight(node.data)}px` }}
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
        )}
      </NodeElement>
    </>
  )
})
