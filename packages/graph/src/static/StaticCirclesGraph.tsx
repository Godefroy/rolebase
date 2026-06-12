import { CircleFullFragment } from '@rolebase/shared/gql'
import React, { useMemo } from 'react'
import { computeVisibleNodes } from '../core/culling'
import { computeLayout } from '../core/layout'
import { GraphRenderContext } from '../react/GraphRenderContext'
import CircleElement from '../react/nodes/CircleElement'
import CircleTitleElement from '../react/nodes/CircleTitleElement'
import MemberElement from '../react/nodes/MemberElement'
import { graphStyles, staticGraphStyles } from '../react/styles'
import {
  CirclesGraphViews,
  GraphColorMode,
  NodeType,
  VisibleNodes,
} from '../types'

export interface StaticCirclesGraphProps {
  view: CirclesGraphViews
  circles: CircleFullFragment[]
  width: number
  height: number
  colorMode?: GraphColorMode
  selectedCircleId?: string
  // Show members and deep circles regardless of the zoom scale
  // (default: same visibility rules as the interactive graph)
  showAllNodes?: boolean
}

// Static render of the graph: no interaction, no animation.
// Works in server rendering (no DOM access) and in a blank page.
// Titles sizing requires a DOM measure: run fitGraphTitles() in the
// browser once the markup is mounted and fonts are loaded.
export default function StaticCirclesGraph({
  view,
  circles,
  width,
  height,
  colorMode = 'light',
  selectedCircleId,
  showAllNodes,
}: StaticCirclesGraphProps) {
  const { root, nodes } = useMemo(
    () => computeLayout(circles, view, selectedCircleId),
    [circles, view, selectedCircleId]
  )

  // Fit the biggest circle in the frame
  const focusNode = nodes.reduce(
    (biggest, n) => (n.r > biggest.r ? n : biggest),
    nodes[0]
  )
  const minSize = Math.min(width, height)
  const k = focusNode?.r ? minSize / (focusNode.r * 2 * 1.01) : 1
  const x = width / 2 - (focusNode?.x || 0) * k
  const y = height / 2 - (focusNode?.y || 0) * k

  const visible: VisibleNodes = useMemo(
    () =>
      computeVisibleNodes({
        root,
        transform: { x, y, k },
        width,
        height,
        graphMinSize: minSize,
        // Same visibility rules as the interactive graph, unless showAllNodes
        renderAll: showAllNodes,
      }),
    [root, x, y, k, width, height, minSize, showAllNodes]
  )

  const renderContext = useMemo(
    () => ({ colorMode, events: {}, isStatic: true }),
    [colorMode]
  )

  return (
    <GraphRenderContext.Provider value={renderContext}>
      <div
        className={`rb-graph rb-graph-static${
          showAllNodes ? ' rb-graph-show-all' : ''
        }`}
        style={
          {
            width: `${width}px`,
            height: `${height}px`,
            '--graph-min-size': minSize,
          } as React.CSSProperties
        }
      >
        <style>{graphStyles + staticGraphStyles}</style>
        <div
          className="rb-graph-panzoom"
          style={
            {
              transform: `translate(${x}px, ${y}px) scale(${k})`,
              '--zoom-scale': k.toString(),
            } as React.CSSProperties
          }
        >
          {visible.nodes.map((node) => {
            const levelHidden = visible.levelHiddenIds.has(node.data.id)
            return node.data.type === NodeType.Circle ? (
              <CircleElement
                key={node.data.id}
                node={node}
                levelHidden={levelHidden}
              />
            ) : node.data.type === NodeType.Member ? (
              <MemberElement
                key={node.data.id}
                node={node}
                levelHidden={levelHidden}
              />
            ) : null
          })}
          {visible.titles.map((node) => (
            <CircleTitleElement key={node.data.id} node={node} />
          ))}
        </div>
      </div>
    </GraphRenderContext.Provider>
  )
}
