import { describe, expect, it } from 'vitest'
import { computeVisibleNodes } from '../src/core/culling'
import { computeLayout } from '../src/core/layout'
import { CirclesGraphViews, NodeType } from '../src/types'

// Build a fake org: `breadth` circles per level, `depth` levels,
// `membersPerCircle` members per circle
function buildCircles(
  breadth: number,
  depth: number,
  membersPerCircle: number
) {
  const circles: any[] = []
  let memberIndex = 0

  const makeCircle = (parentId: string | null, level: number, i: number) => {
    const id = parentId ? `${parentId}.${i}` : 'c0'
    circles.push({
      id,
      orgId: 'org1',
      roleId: `role-${id}`,
      parentId,
      archived: false,
      role: {
        id: `role-${id}`,
        base: false,
        name: `Role ${id}`,
        singleMember: false,
        parentLink: false,
        colorHue: null,
      },
      members: Array.from({ length: membersPerCircle }, () => {
        const mid = `m${memberIndex++}`
        return {
          id: `cm-${mid}`,
          member: {
            id: mid,
            userId: null,
            name: `Member ${mid}`,
            picture: null,
          },
        }
      }),
      invitedCircleLinks: [],
    })
    if (level < depth) {
      for (let j = 0; j < breadth; j++) {
        makeCircle(id, level + 1, j)
      }
    }
  }

  makeCircle(null, 0, 0)
  return circles
}

describe('computeLayout', () => {
  it('packs all circles and members into nodes', () => {
    const circles = buildCircles(3, 3, 2)
    const { root, nodes } = computeLayout(circles, CirclesGraphViews.AllCircles)

    const circleNodes = nodes.filter((n) => n.data.type === NodeType.Circle)
    const memberNodes = nodes.filter((n) => n.data.type === NodeType.Member)

    expect(circleNodes.length).toBe(circles.length)
    expect(memberNodes.length).toBe(circles.length * 2)
    expect(root.data.id).toBe('root')

    // Smallest node has radius 30 (rescaling)
    const minRadius = nodes.reduce((min, n) => Math.min(min, n.r), Infinity)
    expect(minRadius).toBeCloseTo(30, 5)
  })
})

describe('computeVisibleNodes', () => {
  const circles = buildCircles(4, 4, 3)
  const layout = computeLayout(circles, CirclesGraphViews.AllCircles)
  const totalCircles = circles.length

  // Transform fitting the root circle in a 1000x1000 viewport
  const rootNode = layout.nodes[0]
  const fitK = 1000 / (rootNode.r * 2)
  const fit = {
    x: 500 - rootNode.x * fitK,
    y: 500 - rootNode.y * fitK,
    k: fitK,
  }

  it('culls sub-pixel nodes and level-hides members in titled circles', () => {
    const visible = computeVisibleNodes({
      root: layout.root,
      transform: fit,
      width: 1000,
      height: 1000,
      graphMinSize: 1000,
    })

    // Visible nodes are bounded
    expect(visible.nodes.length).toBeGreaterThan(0)
    // Every mounted node (circles and members alike) is above the screen-radius
    // culling threshold
    for (const node of visible.nodes) {
      expect(node.r * fit.k).toBeGreaterThanOrEqual(1.5)
    }
    // Members follow the same rule as circles: a mounted member is hidden
    // (level-hidden) when its containing circle displays its centered title
    const threshold = (2 / 3) * 1000
    for (const node of visible.nodes) {
      if (node.data.type !== NodeType.Member) continue
      const circle = node.parent?.parent
      if (circle && circle.data.id !== 'root' && circle.r * 2 * fit.k < threshold / 1.3) {
        expect(visible.levelHiddenIds.has(node.data.id)).toBe(true)
      }
    }
  })

  it('culls nodes outside of the viewport when zoomed in', () => {
    // Zoom on a leaf circle
    const leaf = layout.nodes
      .filter((n) => n.data.type === NodeType.Circle)
      .reduce((deepest, n) => (n.depth > deepest.depth ? n : deepest))
    const k = 2
    const zoomed = {
      x: 500 - leaf.x * k,
      y: 500 - leaf.y * k,
      k,
    }
    const visible = computeVisibleNodes({
      root: layout.root,
      transform: zoomed,
      width: 1000,
      height: 1000,
      graphMinSize: 1000,
    })

    // Members are mounted at zoom scale > 0.8
    expect(visible.nodes.some((n) => n.data.type === NodeType.Member)).toBe(
      true
    )
    // Far nodes are culled
    expect(visible.nodes.length).toBeLessThan(layout.nodes.length)
    // The focused leaf and its ancestors are visible
    expect(visible.nodes.some((n) => n.data.id === leaf.data.id)).toBe(true)
    expect(visible.nodes.some((n) => n.data.id === leaf.parent?.data.id)).toBe(
      true
    )
  })

  it('hides children of circles that display their centered title', () => {
    const visible = computeVisibleNodes({
      root: layout.root,
      transform: fit,
      width: 1000,
      height: 1000,
      graphMinSize: 1000,
    })

    const threshold = (2 / 3) * 1000
    for (const node of visible.nodes) {
      if (node.data.type !== NodeType.Circle) continue
      const parent =
        node.parent?.data.type === NodeType.MembersCircle
          ? node.parent.parent
          : node.parent
      if (!parent || parent.data.id === 'root') {
        // Top-level circles are never hidden
        expect(visible.levelHiddenIds.has(node.data.id)).toBe(false)
      } else if (parent.r * 2 * fit.k < threshold / 1.3) {
        // Children of a circle clearly below the title threshold are hidden
        expect(visible.levelHiddenIds.has(node.data.id)).toBe(true)
      }
    }

    // Culling exposes the zoom scales at which it must be recomputed
    expect(visible.criticalScales.length).toBeGreaterThan(0)
  })

  it('shows all children when zoomed in (no centered titles)', () => {
    const visible = computeVisibleNodes({
      root: layout.root,
      transform: {
        x: 500 - layout.nodes[0].x * 2,
        y: 500 - layout.nodes[0].y * 2,
        k: 2,
      },
      width: 1000,
      height: 1000,
      graphMinSize: 1000,
    })
    expect(visible.levelHiddenIds.size).toBe(0)
  })

  it('returns all nodes and titles with renderAll', () => {
    const visible = computeVisibleNodes({
      root: layout.root,
      transform: fit,
      width: 1000,
      height: 1000,
      graphMinSize: 1000,
      renderAll: true,
    })

    const expectedNodes = layout.nodes.filter(
      (n) => n.data.type !== NodeType.MembersCircle
    )
    expect(visible.nodes.length).toBe(expectedNodes.length)
    expect(visible.titles.length).toBe(totalCircles)
  })
})
