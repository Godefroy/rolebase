import React, { memo } from 'react'
import { Bounds, TreeLink } from '../types'

interface Props {
  // Edges to draw, already culled
  links: TreeLink[]
  // Bounding box of the whole layout, the SVG frame
  bounds: Bounds
  // Edges whose path this update changed: the cards are gliding to positions
  // these edges already have, so they step aside until the cards arrive. Edges
  // left untouched are not in the set and stay visible.
  movingIds?: Set<string>
}

// Edges of the hierarchical views, drawn from the bottom of a card to the top
// of each of its children. A single <svg> holds every link, so the whole set
// paints into one composited layer instead of one per edge.
export default memo(function TreeLinks({ links, bounds, movingIds }: Props) {
  const { x0, y0, x1, y1 } = bounds
  const width = x1 - x0
  const height = y1 - y0

  if (width <= 0 || height <= 0) return null

  return (
    <svg
      className="tree-links"
      style={{
        left: `${x0}px`,
        top: `${y0}px`,
        width: `${width}px`,
        height: `${height}px`,
      }}
      viewBox={`${x0} ${y0} ${width} ${height}`}
    >
      {links.map((link) => (
        <path
          key={link.id}
          id={`link-${link.id}`}
          className={`tree-link${movingIds?.has(link.id) ? ' moving' : ''}`}
          d={link.path}
        />
      ))}
    </svg>
  )
})
