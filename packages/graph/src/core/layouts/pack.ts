import * as d3 from 'd3'
import settings from '../../settings'
import {
  Data,
  GraphLayoutKind,
  Layout,
  NodeData,
  NodeShape,
  NodeType,
} from '../../types'

// Circle packing layout: children are packed strictly inside their parent.
// This containment is what lets the culling pass use the hierarchy as its own
// spatial index (a node's subtree bounds are its own circle).
export function computePackLayout(
  data: Data,
  packSorting: (a: d3.HierarchyNode<Data>, b: d3.HierarchyNode<Data>) => number
): Layout {
  const packed = packData(data, packSorting)

  // Get all nodes under root and rescale them
  const circularNodes = packed.descendants()
  const minRadius = circularNodes.reduce(
    (min, node) => (node.r < min ? node.r : min),
    Infinity
  )
  const nodeScale = 30 / minRadius
  for (const node of circularNodes) {
    node.r *= nodeScale
    node.x *= nodeScale
    node.y *= nodeScale
  }

  // Enrich with the shared node geometry. A packed circle contains its whole
  // subtree, so its bounds are its own bounding box.
  const allNodes = circularNodes as unknown as NodeData[]
  for (const node of allNodes) {
    node.w = node.r * 2
    node.h = node.r * 2
    node.shape = NodeShape.Circle
    node.bounds = {
      x0: node.x - node.r,
      y0: node.y - node.r,
      x1: node.x + node.r,
      y1: node.y + node.r,
    }
  }

  const root = allNodes[0]
  const nodes = allNodes.slice(1)

  return {
    root,
    nodes,
    kind: GraphLayoutKind.Pack,
    bounds: root.bounds,
    focus: { x: root.x, y: root.y, r: root.r },
    focusBox: root.bounds,
    links: [],
  }
}

function packData(
  data: Data,
  packSorting: (a: d3.HierarchyNode<Data>, b: d3.HierarchyNode<Data>) => number
) {
  const hierarchyNode = d3
    .hierarchy(data)
    .sum((d) => d.value || 0)
    .sort(packSorting)

  return (
    d3
      .pack<Data>()
      .radius(() => settings.memberValue)
      .padding((d) => {
        // Circle
        if (d.data.type === NodeType.Circle) {
          const hasSubCircles = d.data.children?.some(
            (c) => c.type === NodeType.Circle
          )
          if (!hasSubCircles) return settings.padding.circleWithoutSubCircle
          const multipleChildren = (d.data.children?.length || 0) > 1
          return multipleChildren
            ? settings.padding.circleWithSubCircles
            : settings.padding.circleWithSingleSubCircle
        } else if (d.data.type === NodeType.MembersCircle) {
          // Members Circle
          return settings.padding.membersCircle
        }
        return 0
      })(hierarchyNode)

      // Sort by depth and Y, then raise
      .sort((a, b) =>
        // a.depth === b.depth ? a.y - b.y :
        a.depth < b.depth ? -1 : 1
      )
  )
}
