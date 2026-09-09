import { NodeData, NodeType } from '../types'

// Circle a drag should actually land in, given the node under the pointer.
// A parent-link role represents its circle and never holds sub-roles, so a
// role dropped on one lands in the circle it represents. A member dropped on
// one is assigned to it, as on any other role.
export function getDropTargetNode(
  hit: NodeData,
  dragged: NodeData
): NodeData | undefined {
  if (dragged.data.type !== NodeType.Circle) return hit

  let node: NodeData | undefined = hit
  while (node?.data.parentLink) {
    node = node.parent as NodeData | undefined
  }

  // The artificial root is not a drop target
  return node && node.data.id !== 'root' ? node : undefined
}
