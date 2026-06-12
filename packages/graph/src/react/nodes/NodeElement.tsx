import React from 'react'
import { getColor } from '../../helpers/colors'
import { NodeData, NodeType } from '../../types'
import { useGraphRenderContext } from '../GraphRenderContext'
import { useDragNode } from '../hooks/useDragNode'
import useMounted from '../hooks/useMounted'
import { nodeSize } from '../styles'

interface Props extends React.HTMLProps<HTMLDivElement> {
  node: NodeData
  selected?: boolean
  // Inside a circle that displays its centered title: faded out, click-through
  levelHidden?: boolean
  children?: React.ReactNode
}

export default function NodeElement({
  node,
  selected,
  levelHidden,
  style,
  className,
  children,
  ...divProps
}: Props) {
  const { graph, colorMode, isStatic } = useGraphRenderContext()
  const mounted = useMounted()

  const parent =
    node.data.type === NodeType.Member ? node.parent?.parent : node.parent

  const depth = node.depth
  const hue = node.data.colorHue

  // Drag & drop
  const { canDrag, handleMouseDown } = useDragNode(graph, node)

  // Animate from parent position only when the node was added by the last
  // data update. Nodes mounted because they entered the viewport (windowing)
  // are rendered directly at their position.
  const animateEnter =
    !isStatic && !!parent && !!graph?.enteringIds.has(node.data.id) && !mounted

  const bgColor = getColor(colorMode, 94, 16, depth, hue)
  const outlineColor = getColor(colorMode, 75, 35, depth, hue)
  const boxShadowColor = getColor(colorMode, 75, 35, depth, hue)
  const hoverOutlineColor = getColor(colorMode, 88, 22, depth, hue)

  return (
    <div
      id={`node-${node.data.id}`}
      className={`node ${className || ''} ${
        divProps.onClick && !selected ? 'clickable' : ''
      } ${selected ? 'selected' : ''} ${levelHidden ? 'level-hidden' : ''}`}
      style={
        {
          width: `${nodeSize}px`,
          height: `${nodeSize}px`,
          marginLeft: `-${nodeSize / 2}px`,
          marginTop: `-${nodeSize / 2}px`,
          translate: animateEnter
            ? `${parent.x}px ${parent.y}px`
            : `${node.x}px ${node.y}px`,
          scale: animateEnter ? '0' : 'var(--node-scale)',
          cursor: canDrag ? `var(--node-cursor, pointer)` : 'pointer',
          '--node-scale': `${(node.r * 2) / nodeSize}`,
          '--bg-color': bgColor,
          '--outline-color': outlineColor,
          '--hover-outline-color': hoverOutlineColor,
          '--box-shadow-color': boxShadowColor,
          ...style,
        } as React.CSSProperties
      }
      onMouseDown={handleMouseDown}
      {...divProps}
    >
      {children}
    </div>
  )
}
