import React, { memo } from 'react'
import { NodeData, NodeType } from '../types'
import useMounted from './hooks/useMounted'
import CircleElement from './nodes/CircleElement'
import MemberElement from './nodes/MemberElement'

interface Props {
  // Common parent circle of the entering nodes (the animation origin)
  parent: NodeData
  // Entering sibling nodes to reveal together
  nodes: NodeData[]
  levelHiddenIds: Set<string>
}

// Animates a set of entering sibling nodes as a SINGLE composited layer.
// One transform on the wrapper (scale 0 -> 1, anchored at the parent circle
// center) makes every child grow out of the parent together, instead of
// promoting one GPU layer per node (which spiked compositing memory on the
// holarchy select/relayout animation).
//
// The wrapper is sized to the parent circle bounding box (which exactly
// contains the entering children). A zero-size wrapper would get a zero-size
// backing store once composited, forcing each overflowing child onto its own
// layer. The inner div shifts the coordinate origin back to the panzoom origin
// so the children keep their absolute (node.x, node.y) coordinates unchanged.
// At scale 1 the children are exactly at their flat positions, so they hand off
// seamlessly to flat rendering once the animation ends (Graph clears
// enteringIds after the move duration).
export default memo(function EnterGroup({
  parent,
  nodes,
  levelHiddenIds,
}: Props) {
  const mounted = useMounted()
  const r = parent.r
  const left = parent.x - r
  const top = parent.y - r

  return (
    <div
      className="enter-group"
      style={{
        left: `${left}px`,
        top: `${top}px`,
        width: `${2 * r}px`,
        height: `${2 * r}px`,
        // Parent center, relative to the wrapper box
        transformOrigin: `${r}px ${r}px`,
        // scale 0->1 grows the whole group from the parent center; opacity
        // 0->1 forces the subtree to rasterize as one group (and adds a fade).
        transform: `scale(${mounted ? 1 : 0})`,
        opacity: mounted ? 1 : 0,
      }}
    >
      <div
        className="enter-group-content"
        // Cancel the wrapper offset so children keep their panzoom coordinates
        style={{ transform: `translate(${-left}px, ${-top}px)` }}
      >
        {nodes.map((node) =>
          node.data.type === NodeType.Circle ? (
            <CircleElement
              key={node.data.id}
              node={node}
              levelHidden={levelHiddenIds.has(node.data.id)}
              // No leader avatars during the enter: an <img> being scaled by
              // the wrapper would be promoted to its own layer instead of
              // painting into the group. Avatars appear at the flat handoff.
              showLeaders={false}
              inEnterGroup
            />
          ) : node.data.type === NodeType.Member ? (
            <MemberElement
              key={node.data.id}
              node={node}
              levelHidden={levelHiddenIds.has(node.data.id)}
              inEnterGroup
            />
          ) : null
        )}
      </div>
    </div>
  )
})
