import settings from '../settings'
import { NodeData, NodeType } from '../types'

// Roles the minimap draws: whole levels, from the top down, while their
// running total holds in the node budget. Cutting inside a level would leave a
// hole in the chart, and the first level is always drawn, whatever its size.
// The layout hands its nodes sorted by depth, which is the order kept here.
export function minimapNodes(
  nodes: NodeData[],
  maxNodes = settings.minimap.maxNodes
): NodeData[] {
  const circles = nodes.filter((node) => node.data.type === NodeType.Circle)

  let kept = 0
  let index = 0
  while (index < circles.length) {
    let end = index
    while (
      end < circles.length &&
      circles[end].depth === circles[index].depth
    ) {
      end++
    }
    if (kept > 0 && kept + (end - index) > maxNodes) break
    kept = end
    index = end
  }

  return circles.slice(0, kept)
}
