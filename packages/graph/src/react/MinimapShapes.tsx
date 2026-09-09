import React, { memo, useMemo } from 'react'
import { getColor } from '../helpers/colors'
import { minimapNodes } from '../helpers/minimapNodes'
import settings from '../settings'
import { GraphColorMode, NodeData, NodeShape } from '../types'

const { light, dark } = settings.minimap.cardLightness

interface Props {
  // All the roles of the layout, whatever the culling pass kept on screen
  nodes: NodeData[]
  colorMode: GraphColorMode
}

// Bare shapes of the roles, in the colour they have in the graph. Nothing
// else: at this size a border, a name or an avatar would only be noise, and
// they are all the map has to redraw when the layout changes.
export default memo(function MinimapShapes({ nodes, colorMode }: Props) {
  const shapes = useMemo(() => minimapNodes(nodes), [nodes])

  return (
    <>
      {shapes.map((node) => {
        // Packed circles keep the colours of the graph, where nesting already
        // darkens them with depth. A tree card, flat by nature, is drawn a few
        // steps darker than in the graph, or it would barely read at this size.
        const isRect = node.shape === NodeShape.Rect
        const fill = isRect
          ? getColor(colorMode, light, dark, 1, node.data.colorHue)
          : getColor(colorMode, 94, 16, node.depth, node.data.colorHue)

        return isRect ? (
          <rect
            key={node.data.id}
            x={node.x - node.w / 2}
            y={node.y - node.h / 2}
            width={node.w}
            height={node.h}
            rx={settings.minimap.cardRadius}
            fill={fill}
          />
        ) : (
          <circle
            key={node.data.id}
            cx={node.x}
            cy={node.y}
            r={node.r}
            fill={fill}
          />
        )
      })}
    </>
  )
})
