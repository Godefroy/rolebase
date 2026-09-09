import { NodeData, NodeShape } from '../types'
import { isPointInsideCircle } from './isPointInsideCircle'

// Hit test against a laid out node, whatever its shape
export function isPointInsideNode(
  node: NodeData,
  pointX: number,
  pointY: number
): boolean {
  if (node.shape === NodeShape.Rect) {
    return (
      pointX > node.x - node.w / 2 &&
      pointX < node.x + node.w / 2 &&
      pointY > node.y - node.h / 2 &&
      pointY < node.y + node.h / 2
    )
  }
  return isPointInsideCircle(pointX, pointY, node.x, node.y, node.r)
}
