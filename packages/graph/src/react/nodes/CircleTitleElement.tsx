import React, { memo, useEffect, useRef, useState } from 'react'
import settings from '../../settings'
import { NodeData, NodeType } from '../../types'
import { useGraphRenderContext } from '../GraphRenderContext'
import useMounted from '../hooks/useMounted'

interface Props {
  node: NodeData
}

const { baseSize, centerCoverage, gap, rate, threshold, topThreshold } =
  settings.titles

// Memoized: a culling pass only re-renders changed elements
export default memo(function CircleTitleElement({ node }: Props) {
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
    if (!centerRef.current) return
    setCenterSizeRatio(
      (baseSize * centerCoverage) / centerRef.current.offsetWidth
    )
  }, [node.r])

  // Animate from parent position only when the node was added by the last
  // data update (see NodeElement)
  const animateEnter =
    !isStatic && !!graph?.enteringIds.has(node.data.id) && !mounted

  // See NodeElement: no transition on elements much bigger than the viewport
  const giant =
    !!graph &&
    node.r * graph.zoomTransform.k * 2 > 3 * Math.max(graph.width, graph.height)

  return (
    <div
      id={`circle-title-${node.data.id}`}
      className={`circle-title${giant ? ' giant' : ''}`}
      style={{
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
          // Opacity based on:
          // - Zoom scale below 1
          // - Displayed circle size above threshold
          // - Displayed circle size below min size (parent)
          opacity: `min(
            (1 - var(--zoom-scale) - ${gap}) * ${rate},
            1 - (var(--zoom-scale) * ${
              node.r * 2
            } / var(--graph-min-size) - ${threshold} + ${gap}) * ${rate},
            ${
              node.parent && node.parent.data.id !== 'root'
                ? `(var(--zoom-scale) * ${
                    node.parent.r * 2
                  } / var(--graph-min-size) - ${threshold}) * ${rate}`
                : '1'
            }
          )`,
        }}
      >
        {node.data.name}
      </div>
      <div
        className="circle-title-top"
        style={{
          bottom: `${baseSize}px`,
          translate: `0px ${10 / baseSizeRatio}px`,
          // Scale based on:
          // - Light upscale depending on circle size
          // - Light upscale depending on zoom scale
          // - Rescaling with zoom scale and baseSizeRatio
          scale: `calc(
            ${0.2 * (1 + baseSizeRatio / 10)}
            * (1 + var(--zoom-scale) / 2)
            / var(--zoom-scale) / ${baseSizeRatio}
          )`,
          opacity: `max(
            (var(--zoom-scale) - 1) * ${rate} + 1,
            (var(--zoom-scale) * (${
              node.r * 2
            } / var(--graph-min-size)) - ${topThreshold}) * ${rate}
          )`,
        }}
      >
        {node.data.name}
      </div>
    </div>
  )
})
