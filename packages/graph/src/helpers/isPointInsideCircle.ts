export function isPointInsideCircle(
  pointX: number,
  pointY: number,
  circleX: number,
  circleY: number,
  circleRadius: number
): boolean {
  return (
    Math.sqrt((pointX - circleX) ** 2 + (pointY - circleY) ** 2) < circleRadius
  )
}
