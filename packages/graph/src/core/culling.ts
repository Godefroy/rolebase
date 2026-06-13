import settings from '../settings'
import { NodeData, NodeType, TitleVisibility, VisibleNodes } from '../types'

export interface CullingParams {
  root: NodeData
  transform: { x: number; y: number; k: number }
  width: number
  height: number
  graphMinSize: number
  // Members are visible at any zoom scale (e.g. Members view)
  showAllMembers?: boolean
  // Members and deep circles are visible at any zoom scale (e.g. export),
  // viewport culling still applies
  showAllNodes?: boolean
  // Bypass culling and return all nodes and titles (used for static rendering)
  renderAll?: boolean
  // Device pixel ratio: drives more aggressive culling on high-DPR screens,
  // where each mounted node costs DPR² as much GPU memory once composited
  pixelRatio?: number
}

// Windowing: compute the subset of nodes to mount in the DOM.
// The circle packing hierarchy is its own spatial index: children are strictly
// inside their parent, so a top-down traversal with early bail-out
// gives the visible set in O(visible).
export function computeVisibleNodes({
  root,
  transform,
  width,
  height,
  graphMinSize,
  showAllMembers,
  showAllNodes,
  renderAll,
  pixelRatio = 1,
}: CullingParams): VisibleNodes {
  const nodes: NodeData[] = []
  const titles: NodeData[] = []
  const titleVisibility = new Map<string, TitleVisibility>()
  const levelHiddenIds = new Set<string>()
  const criticalScales: number[] = []
  const { x: tx, y: ty, k } = transform
  const {
    minScreenRadius,
    viewportMargin,
    memberScaleMargin,
    titleScaleMargin,
  } = settings.culling
  const { threshold, gap } = settings.titles

  // On high-DPR/touch screens, a composited layer costs DPR² as much GPU
  // memory, so we mount fewer nodes: drop smaller circles earlier and shrink
  // the pre-mount margin. Factor is 1 below DPR 1.5 (no change on desktop),
  // ~2 on a typical phone (DPR 3).
  const dprFactor = Math.max(1, pixelRatio / 1.5)

  // Viewport expanded by a margin, so nodes are mounted before entering it
  const margin = (viewportMargin / dprFactor) * Math.max(width, height)
  // Members are mounted slightly before CSS shows them (when scale > 1)
  const showMembers =
    renderAll || showAllNodes || showAllMembers || k * memberScaleMargin > 1
  // Zoom scale uncertainty: culling is recomputed only when the scale changes
  // by recullScaleRatio, so titles visibility is tested on a scale range
  const kMin = renderAll ? k : k / titleScaleMargin
  const kMax = renderAll ? k : k * titleScaleMargin
  // Zoom scale above which all centered titles are hidden (and all children shown)
  const titlesMaxScale = 1 - gap

  // `levelHidden`: the node is inside a circle that displays its centered
  // title (zoom scale too low for its size), so it's faded out and click-through
  const visit = (node: NodeData, levelHidden: boolean) => {
    if (!renderAll) {
      const screenX = node.x * k + tx
      const screenY = node.y * k + ty
      const screenR = node.r * k

      // Cull subtree when too small to be visible
      // (children are always smaller than their parent)
      if (screenR < minScreenRadius * dprFactor) return

      // Cull subtree when outside of the expanded viewport
      if (
        screenX + screenR < -margin ||
        screenX - screenR > width + margin ||
        screenY + screenR < -margin ||
        screenY - screenR > height + margin
      ) {
        return
      }
    }

    switch (node.data.type) {
      case NodeType.Circle: {
        nodes.push(node)
        if (levelHidden) levelHiddenIds.add(node.data.id)
        if (renderAll || isTitleVisible(node, kMin, kMax, graphMinSize)) {
          titles.push(node)
          // Discrete center/top state at the actual scale (not the conservative
          // mount range): this is what the title renders, with no per-frame
          // --zoom-scale dependency.
          titleVisibility.set(
            node.data.id,
            computeTitleVisibility(node, k, graphMinSize)
          )
          // Re-cull when this title crosses its on-screen size threshold,
          // so its center/top state flips at the right scale (covers leaf
          // circles, which don't push a children threshold below)
          criticalScales.push((threshold * graphMinSize) / (node.r * 2))
        }

        if (!node.children) return

        if (renderAll) {
          for (const child of node.children) {
            visit(child, false)
          }
          return
        }

        if (showAllNodes) {
          for (const child of node.children) {
            visit(child, false)
          }
          return
        }

        // Hide children of a circle that displays its centered title,
        // i.e. when the zoom scale is too low for the circle size
        // (same thresholds as the title CSS opacity formulas, so children
        // crossfade with the title)
        const size = node.r * 2
        // Re-cull when the zoom scale crosses this threshold
        criticalScales.push((threshold * graphMinSize) / size)
        const childrenVisible =
          k >= titlesMaxScale || k * size >= threshold * graphMinSize
        // Keep children mounted on a zoom scale margin around the threshold,
        // so they can fade in/out with the CSS opacity transition
        const childrenMaybeVisible =
          kMax >= titlesMaxScale || kMax * size >= threshold * graphMinSize
        if (childrenMaybeVisible) {
          for (const child of node.children) {
            visit(child, levelHidden || !childrenVisible)
          }
        }
        return
      }

      case NodeType.Member:
        if (showMembers) {
          nodes.push(node)
          // Members of the Members view are never hidden
          if (levelHidden && !showAllMembers) {
            levelHiddenIds.add(node.data.id)
          }
        }
        return

      case NodeType.MembersCircle:
        // Invisible grouping circle: traverse only
        if (node.children) {
          for (const child of node.children) {
            visit(child, levelHidden)
          }
        }
        return
    }
  }

  if (root.children) {
    for (const child of root.children) {
      visit(child, false)
    }
  }

  // Re-cull when all titles disappear (zoom scale 1)
  criticalScales.push(titlesMaxScale)

  return {
    nodes,
    titles,
    titleVisibility,
    cullScale: k,
    levelHiddenIds,
    criticalScales,
  }
}

// Discrete title state at a given zoom scale, mirroring the (steep) CSS
// opacity formulas of CircleTitleElement reduced to booleans. center and top
// are mutually exclusive. Computed once per culling pass so the title carries
// no per-frame --zoom-scale dependency.
function computeTitleVisibility(
  node: NodeData,
  k: number,
  graphMinSize: number
): TitleVisibility {
  const { threshold, topThreshold, gap, rate } = settings.titles
  const size = node.r * 2
  const parent = node.parent
  const isRootChild = !parent || parent.data.id === 'root'
  // Circle (and parent) on-screen size, relative to the visible area
  const onScreen = (k * size) / graphMinSize
  const parentOnScreen = parent
    ? (k * parent.r * 2) / graphMinSize
    : Infinity

  // Center title: zoom scale below 1, circle small enough on screen,
  // and parent circle big enough on screen
  const center =
    k < 1 - gap &&
    onScreen < threshold &&
    (isRootChild || parentOnScreen > threshold)

  // Top title: zoom scale at/above 1, or circle big enough on screen
  const top = k >= 1 - 1 / rate || onScreen >= topThreshold

  return { center, top }
}

// Conservative test of a circle title visibility, derived from the CSS
// opacity formulas of CircleTitleElement. A title is culled only when both
// its center and top variants are guaranteed to be transparent on the
// whole [kMin, kMax] zoom scale range.
const slack = 0.05

function isTitleVisible(
  node: NodeData,
  kMin: number,
  kMax: number,
  graphMinSize: number
) {
  const { threshold, topThreshold } = settings.titles
  const size = node.r * 2
  const parent = node.parent
  const isRootChild = !parent || parent.data.id === 'root'

  // Center title: zoom scale below 1, circle small enough on screen,
  // and parent circle big enough on screen
  const centerVisible =
    kMin < 1 &&
    kMin * size < (threshold + slack) * graphMinSize &&
    (isRootChild || kMax * parent.r * 2 > (threshold - slack) * graphMinSize)

  // Top title: zoom scale above 1, or circle big enough on screen
  const topVisible =
    kMax > 0.99 || kMax * size > (topThreshold - slack) * graphMinSize

  return centerVisible || topVisible
}
