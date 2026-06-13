import React, { memo, useEffect, useRef, useState } from 'react'
import settings from '../../settings'
import { giantViewportRatio } from '../../helpers/device'
import { NodeData, NodeType, TitleVisibility } from '../../types'
import { useGraphRenderContext } from '../GraphRenderContext'
import useMounted from '../hooks/useMounted'

interface Props {
  node: NodeData
  // Discrete center/top visibility, computed by the culling pass
  visibility?: TitleVisibility
  // Zoom scale at the last culling pass (changes between culls, not per frame)
  cullScale: number
  // Temporarily hidden during a select-relayout animation (its node moves)
  hidden?: boolean
}

const { baseSize, centerCoverage } = settings.titles

// Memoized: a culling pass only re-renders changed elements
export default memo(function CircleTitleElement({
  node,
  visibility,
  cullScale,
  hidden,
}: Props) {
  const { graph, isStatic } = useGraphRenderContext()
  const mounted = useMounted()
  const parent =
    node.data.type === NodeType.Member ? node.parent?.parent : node.parent

  const baseSizeRatio = (node.r * 2) / baseSize

  // Center title size: scale to cover the circle.
  // In static rendering, the size is fixed by fitGraphTitles() in the browser
  // (it requires a DOM measure), elements are tagged with data-fit.
  const centerRef = useRef<HTMLDivElement>(null)
  const [centerSizeRatio, setCenterSizeRatio] = useState<number>(0)

  useEffect(() => {
    // Skip while hidden: a display:none element measures 0, which would make
    // the ratio Infinity and break the title. Re-measure when it reappears.
    if (!centerRef.current || hidden) return
    const width = centerRef.current.offsetWidth
    if (width > 0) {
      setCenterSizeRatio((baseSize * centerCoverage) / width)
    }
  }, [node.r, hidden])

  // Animate from parent position only when the node was added by the last
  // data update (see NodeElement)
  const animateEnter =
    !isStatic && !!graph?.enteringIds.has(node.data.id) && !mounted

  // See NodeElement: no transition on elements much bigger than the viewport
  const giant =
    !!graph &&
    node.r * cullScale * 2 >
      giantViewportRatio * Math.max(graph.width, graph.height)

  // Discrete opacities (no per-frame --zoom-scale dependency)
  const centerOpacity = visibility?.center ? 1 : 0
  const topOpacity = visibility?.top ? 1 : 0

  // Top label scale: keep it roughly constant on screen by compensating for
  // the zoom scale. Computed from cullScale (a number that changes only
  // between culls) instead of the per-frame --zoom-scale CSS variable, so the
  // label is never recomposited during a gesture.
  const topScale =
    (0.2 * (1 + baseSizeRatio / 10) * (1 + cullScale / 2)) /
    cullScale /
    baseSizeRatio

  return (
    <div
      id={`circle-title-${node.data.id}`}
      className={`circle-title${giant ? ' giant' : ''}`}
      style={{
        // Hidden while its node is repositioning (no paint, no GPU layer)
        display: hidden ? 'none' : undefined,
        width: `${baseSize}px`,
        height: `${baseSize}px`,
        marginLeft: `-${baseSize / 2}px`,
        marginTop: `-${baseSize / 2}px`,
        translate:
          animateEnter && parent
            ? `${parent.x}px ${parent.y}px`
            : `${node.x}px ${node.y}px`,
        scale: animateEnter ? '0' : baseSizeRatio.toString(),
      }}
    >
      <div
        ref={centerRef}
        className="circle-title-center"
        data-fit={isStatic ? '' : undefined}
        style={{
          transform: `scale(${isStatic ? 0 : centerSizeRatio})`,
          // Shown when the circle is small on screen (low zoom), as a discrete
          // step decided by the culling pass
          opacity: centerOpacity,
        }}
      >
        {node.data.name}
      </div>
      <div
        className="circle-title-top"
        style={{
          bottom: `${baseSize}px`,
          translate: `0px ${10 / baseSizeRatio}px`,
          // Roughly constant on-screen size (see topScale above)
          scale: topScale.toString(),
          // Shown when the circle is big enough on screen, as a discrete step
          // decided by the culling pass
          opacity: topOpacity,
        }}
      >
        {node.data.name}
      </div>
    </div>
  )
})
