import React from 'react'
import { getColor } from '../../helpers/colors'
import { giantViewportRatio } from '../../helpers/device'
import settings from '../../settings'
import { NodeData, NodeShape, NodeType } from '../../types'
import { useGraphRenderContext } from '../GraphRenderContext'
import { useDragNode } from '../hooks/useDragNode'
import useMounted from '../hooks/useMounted'
import { nodeSize } from '../styles'

interface Props extends React.HTMLProps<HTMLDivElement> {
  node: NodeData
  selected?: boolean
  // Inside a circle that displays its centered title: faded out, click-through
  levelHidden?: boolean
  // Rendered inside an EnterGroup wrapper that animates the whole group as one
  // layer: skip the per-node enter animation (the wrapper does it)
  inEnterGroup?: boolean
  children?: React.ReactNode
}

export default function NodeElement({
  node,
  selected,
  levelHidden,
  inEnterGroup,
  hidden,
  style,
  className,
  children,
  ...divProps
}: Props) {
  const { graph, colorMode, isStatic } = useGraphRenderContext()
  const mounted = useMounted()

  const parent =
    node.data.type === NodeType.Member ? node.parent?.parent : node.parent

  const hue = node.data.colorHue

  // Drag & drop
  const { canDrag, handleMouseDown } = useDragNode(graph, node)

  // Animate from parent position only when the node was added by the last
  // data update. Nodes mounted because they entered the viewport (windowing)
  // are rendered directly at their position.
  const animateEnter =
    !isStatic &&
    !inEnterGroup &&
    !!parent &&
    !!graph?.enteringIds.has(node.data.id) &&
    !mounted

  // Nodes much bigger than the viewport must not transition: animating them
  // promotes them to huge composited layers (crash on mobile)
  const giant =
    !!graph &&
    node.r * graph.zoomTransform.k * 2 >
      giantViewportRatio * Math.max(graph.width, graph.height)

  // A rectangular node (a tree card, a member row) is rendered at its layout
  // size rather than scaled from a square, so its text and borders keep their
  // proportions whatever its height
  const isRect = node.shape === NodeShape.Rect
  const isMemberRow = isRect && node.data.type === NodeType.Member

  // Packed circles darken with depth, which is what tells the nesting apart.
  // A tree draws the hierarchy with its edges, so its cards keep the colour of
  // a first-level circle however deep they are, and the member rows they list
  // sit one step lighter on top of them.
  const depth = isRect ? 1 : node.depth
  const { light, dark } = settings.tree.memberLightness

  const bgColor = isMemberRow
    ? getColor(colorMode, light, dark, depth, hue)
    : getColor(colorMode, 94, 16, depth, hue)
  const outlineColor = getColor(colorMode, 75, 35, depth, hue)
  const boxShadowColor = getColor(colorMode, 75, 35, depth, hue)
  const hoverOutlineColor = getColor(colorMode, 88, 22, depth, hue)

  return (
    <div
      id={`node-${node.data.id}`}
      className={`node ${isRect ? 'rect ' : ''}${className || ''} ${
        divProps.onClick && !selected ? 'clickable' : ''
      } ${selected ? 'selected' : ''} ${levelHidden ? 'level-hidden' : ''} ${
        giant ? 'giant' : ''
      } ${inEnterGroup ? 'in-enter-group' : ''}`}
      style={
        {
          width: `${isRect ? node.w : nodeSize}px`,
          height: `${isRect ? node.h : nodeSize}px`,
          marginLeft: `-${(isRect ? node.w : nodeSize) / 2}px`,
          marginTop: `-${(isRect ? node.h : nodeSize) / 2}px`,
          translate: animateEnter
            ? `${parent.x}px ${parent.y}px`
            : `${node.x}px ${node.y}px`,
          scale: animateEnter ? '0' : 'var(--node-scale)',
          cursor: canDrag ? `var(--node-cursor, pointer)` : 'pointer',
          // Hidden during a select-relayout animation: no paint, no GPU layer
          display: hidden ? 'none' : undefined,
          '--node-scale': isRect ? '1' : `${(node.r * 2) / nodeSize}`,
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
