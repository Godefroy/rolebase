import settings from '../settings'
import { NodeData, NodeType, VisibleNodes } from '../types'

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
}: CullingParams): VisibleNodes {
  const nodes: NodeData[] = []
  const titles: NodeData[] = []
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

  // Viewport expanded by a margin, so nodes are mounted before entering it
  const margin = viewportMargin * Math.max(width, height)
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
      if (screenR < minScreenRadius) return

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

  return { nodes, titles, levelHiddenIds, criticalScales }
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
