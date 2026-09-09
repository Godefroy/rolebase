import { OrgData } from '@rolebase/shared/model/OrgData'
import React, { useMemo } from 'react'
import { computeVisibleNodes } from '../core/culling'
import { computeLayout } from '../core/layout'
import { GraphRenderContext } from '../react/GraphRenderContext'
import TreeLinks from '../react/TreeLinks'
import CardElement from '../react/nodes/CardElement'
import CardMemberElement from '../react/nodes/CardMemberElement'
import CircleElement from '../react/nodes/CircleElement'
import CircleTitleElement from '../react/nodes/CircleTitleElement'
import MemberElement from '../react/nodes/MemberElement'
import { graphStyles, staticGraphStyles } from '../react/styles'
import {
  CirclesGraphViews,
  GraphColorMode,
  GraphLayoutKind,
  NodeType,
  VisibleNodes,
} from '../types'

export interface StaticCirclesGraphProps {
  view: CirclesGraphViews
  org: OrgData
  width: number
  height: number
  colorMode?: GraphColorMode
  selectedCircleId?: string
  // List the members inside the circles (default: yes). When off they are left
  // out of the layout, so nothing keeps room for them.
  showMembers?: boolean
}

// Static render of the graph: no interaction, no animation.
// Works in server rendering (no DOM access) and in a blank page.
// Titles sizing requires a DOM measure: run fitGraphTitles() in the
// browser once the markup is mounted and fonts are loaded.
export default function StaticCirclesGraph({
  view,
  org,
  width,
  height,
  colorMode = 'light',
  selectedCircleId,
  showMembers = true,
}: StaticCirclesGraphProps) {
  const layout = useMemo(
    () =>
      computeLayout(org, view, selectedCircleId, {
        hideMembers: !showMembers,
      }),
    [org, view, selectedCircleId, showMembers]
  )
  const { root } = layout
  const isTree = layout.kind === GraphLayoutKind.Tree

  // Fit the whole layout in the frame, the same way the interactive graph
  // frames it on its first draw. Framing the biggest circle instead would
  // centre a flat view on whichever circle happens to be the largest.
  const minSize = Math.min(width, height)
  // A tree is much wider than it is tall: fit it to both dimensions
  const box = layout.focusBox
  const boxWidth = box.x1 - box.x0
  const boxHeight = box.y1 - box.y0
  const frame = isTree
    ? {
        x: (box.x0 + box.x1) / 2,
        y: (box.y0 + box.y1) / 2,
        k:
          boxWidth > 0 && boxHeight > 0
            ? Math.min(width / boxWidth, height / boxHeight) / 1.01
            : 1,
      }
    : {
        x: layout.focus.x,
        y: layout.focus.y,
        k: layout.focus.r ? minSize / (layout.focus.r * 2 * 1.01) : 1,
      }
  const k = frame.k
  const x = width / 2 - frame.x * k
  const y = height / 2 - frame.y * k

  const visible: VisibleNodes = useMemo(
    () =>
      computeVisibleNodes({
        root,
        layout: layout.kind,
        links: layout.links,
        transform: { x, y, k },
        width,
        height,
        graphMinSize: minSize,
        // A fixed image has no zoom to interpret: it renders everything the
        // layout holds, and the layout is what decides on the members
        renderAll: true,
      }),
    [root, layout.kind, layout.links, x, y, k, width, height, minSize]
  )

  const renderContext = useMemo(
    () => ({ colorMode, events: {}, isStatic: true }),
    [colorMode]
  )

  return (
    <GraphRenderContext.Provider value={renderContext}>
      <div
        className={`rb-graph rb-graph-static rb-graph-show-all${
          isTree ? ' rb-graph-tree' : ''
        }`}
        style={
          {
            width: `${width}px`,
            height: `${height}px`,
            '--graph-min-size': minSize,
            // Opaque: a translucent stroke would darken where edges cross
            '--link-color': colorMode === 'dark' ? '#585c66' : '#cbcbd1',
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
              // Discrete leader-avatar visibility (see Panzoom). Members follow
              // the level-hidden rule; show-all exports force them visible via
              // .rb-graph-show-all.
              '--leaders-opacity': k > 1 ? '1' : '0',
            } as React.CSSProperties
          }
        >
          {isTree && <TreeLinks links={visible.links} bounds={layout.bounds} />}
          {visible.nodes.map((node) => {
            const levelHidden = visible.levelHiddenIds.has(node.data.id)
            return node.data.type === NodeType.Circle ? (
              isTree ? (
                <CardElement key={node.data.id} node={node} />
              ) : (
                <CircleElement
                  key={node.data.id}
                  node={node}
                  levelHidden={levelHidden}
                />
              )
            ) : node.data.type === NodeType.Member ? (
              isTree ? (
                <CardMemberElement key={node.data.id} node={node} />
              ) : (
                <MemberElement
                  key={node.data.id}
                  node={node}
                  levelHidden={levelHidden}
                />
              )
            ) : null
          })}
          {!isTree &&
            visible.titles.map((node) => (
              <CircleTitleElement
                key={node.data.id}
                node={node}
                visibility={visible.titleVisibility.get(node.data.id)}
                cullScale={visible.cullScale}
              />
            ))}
        </div>
      </div>
    </GraphRenderContext.Provider>
  )
}
