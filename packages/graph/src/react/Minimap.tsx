import React, { memo, useRef, useState } from 'react'
import { Graph } from '../core/Graph'
import { smallScreenMediaQuery } from '../helpers/device'
import settings from '../settings'
import { useGraphRenderContext } from './GraphRenderContext'
import { useGraphViewport } from './hooks/useGraphViewport'
import { useMediaQuery } from './hooks/useMediaQuery'
import MinimapShapes from './MinimapShapes'

const { size, maxGraphRatio, margin } = settings.minimap

interface Props {
  graph: Graph
}

// Overview of the whole layout, in the corner of the graph. It answers one
// question, where the view sits in a chart too big for the screen, so it draws
// the bare shapes of the roles and disappears as soon as everything fits.
// Clicking or dragging it moves the view: the pointer is the centre.
export default memo(function Minimap({ graph }: Props) {
  const { colorMode } = useGraphRenderContext()
  const { transform, width, height, focusCrop, nodes } = useGraphViewport(graph)
  const smallScreen = useMediaQuery(smallScreenMediaQuery)
  const [dragging, setDragging] = useState(false)
  const svgRef = useRef<SVGSVGElement>(null)

  const { x0, y0, x1, y1 } = graph.layoutBounds
  const layoutWidth = x1 - x0
  const layoutHeight = y1 - y0

  // Move the view where the pointer points, in layout coordinates. The graph
  // holds the point inside its pan extent, so a drag can leave the map.
  const centerOnPointer = (event: React.PointerEvent<SVGSVGElement>) => {
    const map = svgRef.current?.getBoundingClientRect()
    if (!map || map.width === 0 || map.height === 0) return
    graph.centerOn(
      x0 + ((event.clientX - map.left) / map.width) * layoutWidth,
      y0 + ((event.clientY - map.top) / map.height) * layoutHeight
    )
  }

  const handlePointerDown = (event: React.PointerEvent<SVGSVGElement>) => {
    // The pointer keeps sending to the map once it has left it
    event.currentTarget.setPointerCapture(event.pointerId)
    setDragging(true)
    centerOnPointer(event)
  }

  const handlePointerMove = (event: React.PointerEvent<SVGSVGElement>) => {
    if (dragging) centerOnPointer(event)
  }

  const handlePointerUp = (event: React.PointerEvent<SVGSVGElement>) => {
    event.currentTarget.releasePointerCapture(event.pointerId)
    setDragging(false)
  }

  // A phone gives the whole screen to the graph: no corner for the map
  if (smallScreen) return null
  if (layoutWidth <= 0 || layoutHeight <= 0 || nodes.length === 0) return null

  // Visible area: what a panel covers is not on screen
  const { top, right, bottom, left } = focusCrop
  const cropWidth = width - left - right
  const cropHeight = height - top - bottom

  // Nothing left to locate once the whole layout is in the visible area
  const { k, x, y } = transform
  if (
    x0 * k + x >= left - 1 &&
    y0 * k + y >= top - 1 &&
    x1 * k + x <= width - right + 1 &&
    y1 * k + y <= height - bottom + 1
  ) {
    return null
  }

  // The map holds the proportions of the layout: its smallest side is fixed,
  // never above a ratio of the graph on that same side, and the other one is
  // as long as those proportions make it, up to the visible area minus its
  // margins. The chart fills it edge to edge, with no empty band around it.
  const isFlat = layoutWidth >= layoutHeight
  const smallSide = Math.min(
    size,
    (isFlat ? cropHeight : cropWidth) * maxGraphRatio
  )
  const scale = Math.min(
    smallSide / Math.min(layoutWidth, layoutHeight),
    (cropWidth - 2 * margin) / layoutWidth,
    (cropHeight - 2 * margin) / layoutHeight
  )
  const mapWidth = layoutWidth * scale
  const mapHeight = layoutHeight * scale

  // Frame of the visible area, in layout coordinates, and the scrim that dims
  // what is outside it: one path, the frame punched out of the map with the
  // even-odd rule
  const frameX = (left - x) / k
  const frameY = (top - y) / k
  const frameX1 = frameX + cropWidth / k
  const frameY1 = frameY + cropHeight / k
  const scrim = [
    `M${x0},${y0}H${x1}V${y1}H${x0}Z`,
    `M${frameX},${frameY}H${frameX1}V${frameY1}H${frameX}Z`,
  ].join(' ')

  return (
    <div
      className={`rb-graph-minimap${dragging ? ' dragging' : ''}`}
      style={{
        // Corner of the visible area, so a side panel never covers the map
        right: `${right + margin}px`,
        bottom: `${bottom + margin}px`,
        width: `${mapWidth}px`,
        height: `${mapHeight}px`,
      }}
    >
      <svg
        ref={svgRef}
        width={mapWidth}
        height={mapHeight}
        viewBox={`${x0} ${y0} ${layoutWidth} ${layoutHeight}`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        <MinimapShapes nodes={nodes} colorMode={colorMode} />
        <path className="minimap-scrim" d={scrim} fillRule="evenodd" />
        <rect
          className="minimap-viewport"
          x={frameX}
          y={frameY}
          width={cropWidth / k}
          height={cropHeight / k}
        />
      </svg>
    </div>
  )
})
