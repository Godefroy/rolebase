import { Governance_Mode_Enum } from '@rolebase/shared/gql'
import { OrgData } from '@rolebase/shared/model/OrgData'
import { describe, expect, it } from 'vitest'
import { computeVisibleNodes } from '../src/core/culling'
import { computeLayout } from '../src/core/layout'
import {
  cardShowsLeaders,
  cardTitleHeight,
  titleLineCount,
} from '../src/core/layouts/tree'
import { getDropTargetNode } from '../src/helpers/getDropTargetNode'
import { minimapNodes } from '../src/helpers/minimapNodes'
import graphSettings from '../src/settings'
import {
  CirclesGraphViews,
  GraphLayoutKind,
  NodeShape,
  NodeType,
} from '../src/types'

// Build a fake org: `breadth` circles per level, `depth` levels,
// `membersPerCircle` members per circle
function buildOrg(
  breadth: number,
  depth: number,
  membersPerCircle: number
): OrgData {
  const circles: any[] = []
  const roles: any[] = []
  const members: any[] = []
  const circleMembers: any[] = []
  let memberIndex = 0

  const makeCircle = (parentId: string | null, level: number, i: number) => {
    const id = parentId ? `${parentId}.${i}` : 'c0'
    const roleId = `role-${id}`
    circles.push({ id, orgId: 'org1', roleId, parentId, archived: false })
    roles.push({
      id: roleId,
      base: false,
      name: `Role ${id}`,
      singleMember: false,
      parentLink: false,
      colorHue: null,
    })
    for (let k = 0; k < membersPerCircle; k++) {
      const mid = `m${memberIndex++}`
      members.push({
        id: mid,
        orgId: 'org1',
        archived: false,
        name: `Member ${mid}`,
        description: '',
      })
      circleMembers.push({
        id: `cm-${id}-${mid}`,
        orgId: 'org1',
        circleId: id,
        memberId: mid,
        createdAt: '',
        archived: false,
      })
    }
    if (level < depth) {
      for (let j = 0; j < breadth; j++) {
        makeCircle(id, level + 1, j)
      }
    }
  }

  makeCircle(null, 0, 0)
  return new OrgData({
    circles,
    circleMembers,
    circleLinks: [],
    roles,
    members,
    governanceMode: Governance_Mode_Enum.Strict,
  })
}

describe('computeLayout', () => {
  it('packs all circles and members into nodes', () => {
    const org = buildOrg(3, 3, 2)
    const { root, nodes } = computeLayout(org, CirclesGraphViews.Circles)

    const circleNodes = nodes.filter((n) => n.data.type === NodeType.Circle)
    const memberNodes = nodes.filter((n) => n.data.type === NodeType.Member)

    expect(circleNodes.length).toBe(org.circles.length)
    expect(memberNodes.length).toBe(org.circles.length * 2)
    expect(root.data.id).toBe('root')

    // Smallest node has radius 30 (rescaling)
    const minRadius = nodes.reduce((min, n) => Math.min(min, n.r), Infinity)
    expect(minRadius).toBeCloseTo(30, 5)
  })
})

describe('computeVisibleNodes', () => {
  const org = buildOrg(4, 4, 3)
  const layout = computeLayout(org, CirclesGraphViews.Circles)
  const totalCircles = org.circles.length

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
      if (
        circle &&
        circle.data.id !== 'root' &&
        circle.r * 2 * fit.k < threshold / 1.3
      ) {
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

describe('computeTreeLayout', () => {
  const org = buildOrg(3, 3, 2)
  const layout = computeLayout(org, CirclesGraphViews.Tree)
  const cards = layout.nodes.filter((n) => n.data.type === NodeType.Circle)
  const members = layout.nodes.filter((n) => n.data.type === NodeType.Member)

  it('lays out every circle as a card and every member as an avatar', () => {
    expect(layout.kind).toBe(GraphLayoutKind.Tree)
    expect(cards.length).toBe(org.circles.length)
    expect(members.length).toBe(org.circles.length * 2)
  })

  it('gives all cards the same width and stacks levels top-down', () => {
    for (const card of cards) {
      expect(card.shape).toBe(NodeShape.Rect)
      expect(card.w).toBe(graphSettings.tree.cardWidth)
    }
    // A card is strictly below its parent card
    for (const card of cards) {
      const parent = card.parent
      if (!parent || parent.data.id === 'root') continue
      expect(card.y - card.h / 2).toBeGreaterThan(parent.y + parent.h / 2)
    }
  })

  it('hangs sibling cards of different heights from a shared top edge', () => {
    // Two siblings with different member counts, so their cards differ in
    // height: they must line up on their top, not on their center
    const unevenOrg = buildUnevenOrg()
    const uneven = computeLayout(unevenOrg, CirclesGraphViews.Tree)
    const siblings = uneven.nodes.filter(
      (n) => n.data.type === NodeType.Circle && n.depth === 2
    )

    expect(siblings.length).toBe(2)
    const [a, b] = siblings
    // Different heights, so the two alignments really differ
    expect(a.h).not.toBeCloseTo(b.h, 5)
    expect(a.y - a.h / 2).toBeCloseTo(b.y - b.h / 2, 5)
  })

  it('lists members as rows inside their card', () => {
    for (const member of members) {
      const card = member.parent?.parent
      if (!card) throw new Error('Member without card')
      expect(member.shape).toBe(NodeShape.Rect)
      // A row spans the card width, minus its padding
      expect(member.w).toBeLessThan(card.w)
      expect(member.x).toBeCloseTo(card.x, 5)
      // And stays inside the card
      expect(member.x - member.w / 2).toBeGreaterThanOrEqual(
        card.x - card.w / 2
      )
      expect(member.x + member.w / 2).toBeLessThanOrEqual(card.x + card.w / 2)
      expect(member.y - member.h / 2).toBeGreaterThanOrEqual(
        card.y - card.h / 2
      )
      expect(member.y + member.h / 2).toBeLessThanOrEqual(card.y + card.h / 2)
    }

    // Rows of the same card are stacked, never overlapping
    const byCard = new Map<string, typeof members>()
    for (const member of members) {
      const cardId = member.parent!.parent!.data.id
      byCard.set(cardId, [...(byCard.get(cardId) ?? []), member])
    }
    for (const rows of byCard.values()) {
      const sorted = [...rows].sort((a, b) => a.y - b.y)
      for (let i = 1; i < sorted.length; i++) {
        expect(sorted[i].y - sorted[i].h / 2).toBeGreaterThanOrEqual(
          sorted[i - 1].y + sorted[i - 1].h / 2
        )
      }
    }
  })

  it('bounds every node subtree', () => {
    for (const node of layout.nodes) {
      for (const child of node.children ?? []) {
        expect(child.bounds.x0).toBeGreaterThanOrEqual(node.bounds.x0)
        expect(child.bounds.y0).toBeGreaterThanOrEqual(node.bounds.y0)
        expect(child.bounds.x1).toBeLessThanOrEqual(node.bounds.x1)
        expect(child.bounds.y1).toBeLessThanOrEqual(node.bounds.y1)
      }
    }
    // The root frames the whole layout
    expect(layout.focus.r).toBeCloseTo(
      Math.max(
        layout.bounds.x1 - layout.bounds.x0,
        layout.bounds.y1 - layout.bounds.y0
      ) / 2,
      5
    )
  })

  it('folds the tree on the selected circle', () => {
    const child = org.circles.find((c) => c.parentId === 'c0')!
    const folded = computeLayout(org, CirclesGraphViews.Tree, true, child.id)
    const foldedIds = folded.nodes
      .filter((n) => n.data.type === NodeType.Circle)
      .map((n) => n.data.id)

    // The root, the selected circle and its direct children, nothing deeper
    expect(foldedIds).toContain('c0')
    expect(foldedIds).toContain(child.id)
    expect(foldedIds.length).toBeLessThan(cards.length)
    for (const id of foldedIds) {
      expect(id.split('.').length).toBeLessThanOrEqual(3)
    }
  })
})

// Root circle with two children holding 1 and 7 members: their cards differ
// in height
function buildUnevenOrg(): OrgData {
  const circles: any[] = []
  const roles: any[] = []
  const members: any[] = []
  const circleMembers: any[] = []
  let memberIndex = 0

  const add = (id: string, parentId: string | null, memberCount: number) => {
    circles.push({
      id,
      orgId: 'org1',
      roleId: `role-${id}`,
      parentId,
      archived: false,
    })
    roles.push({
      id: `role-${id}`,
      base: false,
      name: `Role ${id}`,
      singleMember: false,
      parentLink: false,
      colorHue: null,
    })
    for (let k = 0; k < memberCount; k++) {
      const mid = `um${memberIndex++}`
      members.push({
        id: mid,
        orgId: 'org1',
        archived: false,
        name: `Member ${mid}`,
        description: '',
      })
      circleMembers.push({
        id: `cm-${id}-${mid}`,
        orgId: 'org1',
        circleId: id,
        memberId: mid,
        createdAt: '',
        archived: false,
      })
    }
  }

  add('u0', null, 1)
  add('u0.a', 'u0', 1)
  add('u0.b', 'u0', 7)

  return new OrgData({
    circles,
    circleMembers,
    circleLinks: [],
    roles,
    members,
    governanceMode: Governance_Mode_Enum.Strict,
  })
}

describe('computeVisibleNodes on a tree', () => {
  const org = buildOrg(3, 3, 2)
  const layout = computeLayout(org, CirclesGraphViews.Tree)
  const fitK =
    1000 /
    Math.max(
      layout.bounds.x1 - layout.bounds.x0,
      layout.bounds.y1 - layout.bounds.y0
    )
  const fit = {
    x: 500 - layout.focus.x * fitK,
    y: 500 - layout.focus.y * fitK,
    k: fitK,
  }

  it('mounts cards and never level-hides them', () => {
    const visible = computeVisibleNodes({
      root: layout.root,
      layout: layout.kind,
      transform: fit,
      width: 1000,
      height: 1000,
      graphMinSize: 1000,
    })

    expect(visible.nodes.some((n) => n.data.type === NodeType.Circle)).toBe(
      true
    )
    expect(visible.levelHiddenIds.size).toBe(0)
    // Cards carry their own name: no separate title layer
    expect(visible.titles.length).toBe(0)
  })

  it('culls cards outside of the viewport but keeps their visible children', () => {
    // Zoom on the deepest card
    const deepest = layout.nodes
      .filter((n) => n.data.type === NodeType.Circle)
      .reduce((acc, n) => (n.depth > acc.depth ? n : acc))
    const k = 1
    const visible = computeVisibleNodes({
      root: layout.root,
      layout: layout.kind,
      transform: { x: 500 - deepest.x * k, y: 500 - deepest.y * k, k },
      width: 1000,
      height: 1000,
      graphMinSize: 1000,
    })

    expect(visible.nodes.some((n) => n.data.id === deepest.data.id)).toBe(true)
    expect(visible.nodes.length).toBeLessThan(layout.nodes.length)
    // A card far above is culled while the focused one is mounted
    const far = layout.nodes.find(
      (n) => n.data.type === NodeType.Circle && Math.abs(n.x - deepest.x) > 3000
    )
    if (far) {
      expect(visible.nodes.some((n) => n.data.id === far.data.id)).toBe(false)
    }
  })

  it('drops member avatars when they are too small on screen', () => {
    const visible = computeVisibleNodes({
      root: layout.root,
      layout: layout.kind,
      transform: { x: 500, y: 500, k: 0.1 },
      width: 1000,
      height: 1000,
      graphMinSize: 1000,
    })
    expect(visible.nodes.some((n) => n.data.type === NodeType.Member)).toBe(
      false
    )
  })
})

describe('tree links culling', () => {
  const org = buildOrg(3, 3, 2)
  const layout = computeLayout(org, CirclesGraphViews.Tree)

  it('builds one edge per card below the root', () => {
    const cards = layout.nodes.filter((n) => n.data.type === NodeType.Circle)
    // Every card except the single top-level one has an edge to its parent
    expect(layout.links.length).toBe(cards.length - 1)
    expect(layout.links.every((l) => l.path.startsWith('M'))).toBe(true)
  })

  it('keeps an edge crossing the viewport when both its cards are culled', () => {
    // Frame the gap between the root card and its children: neither endpoint
    // is on screen, but the edge runs right through the viewport
    const root = layout.nodes.find(
      (n) => n.data.type === NodeType.Circle && n.depth === 1
    )!
    const child = (root.children ?? []).find(
      (n) => n.data.type === NodeType.Circle
    )!
    const midY = (root.y + root.h / 2 + (child.y - child.h / 2)) / 2
    const k = 1
    const visible = computeVisibleNodes({
      root: layout.root,
      layout: layout.kind,
      links: layout.links,
      transform: { x: 200 - root.x * k, y: 100 - midY * k, k },
      width: 400,
      height: 200,
      graphMinSize: 200,
    })

    const link = visible.links.find((l) => l.id === child.data.id)
    expect(link).toBeDefined()
    // The edge is mounted even though the card it leads to is not
    expect(visible.nodes.some((n) => n.data.id === child.data.id)).toBe(false)
  })

  it('drops edges that are far outside the viewport', () => {
    const visible = computeVisibleNodes({
      root: layout.root,
      layout: layout.kind,
      links: layout.links,
      transform: { x: -50000, y: -50000, k: 1 },
      width: 400,
      height: 200,
      graphMinSize: 200,
    })
    expect(visible.links.length).toBe(0)
  })

  it('returns every edge with renderAll', () => {
    const visible = computeVisibleNodes({
      root: layout.root,
      layout: layout.kind,
      links: layout.links,
      transform: { x: 0, y: 0, k: 1 },
      width: 400,
      height: 200,
      graphMinSize: 200,
      renderAll: true,
    })
    expect(visible.links.length).toBe(layout.links.length)
  })
})

// Title block height of a card carrying this name
const titleHeight = (name: string) =>
  cardTitleHeight({ id: 'card', name, type: NodeType.Circle })

describe('tree cards', () => {
  it('sizes the title block from the wrapped name', () => {
    const short = titleLineCount('Design')
    const long = titleLineCount(
      'Responsable du développement backend et infrastructure'
    )
    expect(short).toBe(1)
    expect(long).toBeGreaterThan(1)
    expect(titleHeight('Design')).toBeLessThan(
      titleHeight('Responsable du développement backend et infrastructure')
    )

    // A name that would take more lines than the cap is clamped
    expect(titleLineCount('mot '.repeat(200))).toBe(
      graphSettings.tree.titleMaxLines
    )
  })

  it('grows the card, and pushes its member rows down, with the title', () => {
    const org = buildOrg(2, 1, 2)
    const layout = computeLayout(org, CirclesGraphViews.Tree)
    const card = layout.nodes.find((n) => n.data.type === NodeType.Circle)!
    const firstRow = layout.nodes.find(
      (n) => n.data.type === NodeType.Member && n.parent?.parent === card
    )!

    // The first row starts right below the title block
    expect(firstRow.y - firstRow.h / 2).toBeCloseTo(
      card.y - card.h / 2 + cardTitleHeight(card.data),
      5
    )
  })
})

// Root circle with a parent-link child ("Leader") and two normal children
function buildParentLinkOrg(): OrgData {
  const circles: any[] = []
  const roles: any[] = []

  const members: any[] = []
  const circleMembers: any[] = []

  const add = (
    id: string,
    parentId: string | null,
    parentLink: boolean,
    name = `Role ${id}`,
    memberCount = 0
  ) => {
    circles.push({
      id,
      orgId: 'org1',
      roleId: `role-${id}`,
      parentId,
      archived: false,
    })
    roles.push({
      id: `role-${id}`,
      base: false,
      name,
      singleMember: false,
      parentLink,
      colorHue: null,
    })
    for (let k = 0; k < memberCount; k++) {
      const mid = `pm-${id}-${k}`
      members.push({
        id: mid,
        orgId: 'org1',
        archived: false,
        name: `Member ${mid}`,
        description: '',
      })
      circleMembers.push({
        id: `cm-${id}-${mid}`,
        orgId: 'org1',
        circleId: id,
        memberId: mid,
        createdAt: '',
        archived: false,
      })
    }
  }

  add('p0', null, false, 'Role p0', 2)
  // Two representative roles, added in reverse alphabetical order
  add('p0.link', 'p0', true, 'Zeta')
  add('p0.link2', 'p0', true, 'Alpha')
  add('p0.a', 'p0', false)
  add('p0.b', 'p0', false)

  return new OrgData({
    circles,
    circleMembers,
    circleLinks: [],
    roles,
    members,
    governanceMode: Governance_Mode_Enum.Strict,
  })
}

describe('parent-link cards', () => {
  const layout = computeLayout(buildParentLinkOrg(), CirclesGraphViews.Tree)
  const card = (id: string) => layout.nodes.find((n) => n.data.id === id)!

  it('stacks them under the card they represent, not beside its children', () => {
    const parent = card('p0')
    const link = card('p0.link')
    const a = card('p0.a')
    const b = card('p0.b')

    // Directly under its parent, on the same axis
    expect(link.x).toBeCloseTo(parent.x, 5)
    expect(link.y - link.h / 2).toBeGreaterThan(parent.y + parent.h / 2)

    // The normal children share a level, below the stack, and are spread apart
    expect(a.y - a.h / 2).toBeCloseTo(b.y - b.h / 2, 5)
    expect(a.y - a.h / 2).toBeGreaterThan(link.y + link.h / 2)
    expect(a.x).not.toBeCloseTo(b.x, 5)
    // Neither of them sits on the stacked card's level
    expect(a.y).not.toBeCloseTo(link.y, 5)
  })

  it('stacks them in the order the role panel lists them', () => {
    const parent = card('p0')
    const alpha = card('p0.link2')
    const zeta = card('p0.link')

    // Sorted by name, whatever their order in the data
    expect(alpha.y).toBeLessThan(zeta.y)
    expect(alpha.y - alpha.h / 2).toBeGreaterThan(parent.y + parent.h / 2)
    // And the normal children hang below the bottom of the stack
    expect(card('p0.a').y - card('p0.a').h / 2).toBeGreaterThan(
      zeta.y + zeta.h / 2
    )
  })

  it('hangs the sibling edges from the bottom of the stack', () => {
    const parent = card('p0')
    const bottom = card('p0.link')
    const startY = (id: string) => {
      const path = layout.links.find((l) => l.id === id)!.path
      return Number(path.match(/^M[-\d.]+,([-\d.]+)/)![1])
    }

    // The first stacked card hangs from its parent
    expect(startY('p0.link2')).toBeCloseTo(parent.y + parent.h / 2, 5)
    // The cards of a stack are flush against each other: no edge between them
    expect(layout.links.find((l) => l.id === 'p0.link')).toBeUndefined()
    // The siblings hang from the bottom of the stack, not from the parent
    expect(startY('p0.a')).toBeCloseTo(bottom.y + bottom.h / 2, 5)
    expect(startY('p0.b')).toBeCloseTo(bottom.y + bottom.h / 2, 5)
  })
})

describe('members card', () => {
  const layout = computeLayout(buildParentLinkOrg(), CirclesGraphViews.Tree)
  const card = (id: string) => layout.nodes.find((n) => n.data.id === id)!
  const membersCards = layout.nodes.filter((n) => n.data.membersCard)

  it('moves the members of a role with a representative to a nameless card', () => {
    // Only p0 has both members and a representative role
    expect(membersCards.length).toBe(1)
    const membersCard = membersCards[0]
    const role = card('p0')

    expect(membersCard.data.name).toBe('')
    // It stands for the role above it
    expect(membersCard.parent).toBe(role)
    expect(membersCard.data.entityId).toBe(role.data.id)
    // And holds the rows that role no longer lists
    const rows = membersCard
      .descendants()
      .filter((n) => n.data.type === NodeType.Member)
    expect(rows.length).toBe(2)
    for (const row of rows) {
      expect(row.y - row.h / 2).toBeGreaterThanOrEqual(
        membersCard.y - membersCard.h / 2
      )
      expect(row.data.parentId).toBe(role.data.id)
    }

    // The role card is left as short as one with no member at all
    expect(role.h).toBeCloseTo(
      cardTitleHeight(role.data) + graphSettings.tree.cardPadding,
      5
    )
    // Below the stack of representatives, first among the sub-roles
    const siblings = [membersCard, card('p0.a'), card('p0.b')].sort(
      (a, b) => a.x - b.x
    )
    expect(siblings[0]).toBe(membersCard)
    expect(membersCard.y - membersCard.h / 2).toBeCloseTo(
      card('p0.a').y - card('p0.a').h / 2,
      5
    )
  })

  it('keeps the members of a role without a representative inside its card', () => {
    // Every circle here holds members and sub-roles, and none is a representative
    const withSubRoles = computeLayout(
      buildOrg(2, 1, 2),
      CirclesGraphViews.Tree
    )
    expect(withSubRoles.nodes.some((n) => n.data.membersCard)).toBe(false)

    const parent = withSubRoles.nodes.find((n) => n.data.id === 'c0')!
    const rows = parent
      .descendants()
      .filter(
        (n) => n.data.type === NodeType.Member && n.parent?.parent === parent
      )
    expect(rows.length).toBe(2)
    for (const row of rows) {
      expect(row.y + row.h / 2).toBeLessThanOrEqual(parent.y + parent.h / 2)
    }
  })
})

// Root with two children, the second holding members and a representative,
// invited into the first through a circle link
function buildLinkOrg(): OrgData {
  const circles: any[] = []
  const roles: any[] = []
  const members: any[] = []
  const circleMembers: any[] = []

  const add = (
    id: string,
    parentId: string | null,
    parentLink: boolean,
    memberIds: string[] = []
  ) => {
    circles.push({
      id,
      orgId: 'org1',
      roleId: `role-${id}`,
      parentId,
      archived: false,
    })
    roles.push({
      id: `role-${id}`,
      base: false,
      name: `Role ${id}`,
      singleMember: false,
      parentLink,
      colorHue: null,
    })
    for (const mid of memberIds) {
      if (!members.some((m) => m.id === mid)) {
        members.push({
          id: mid,
          orgId: 'org1',
          archived: false,
          name: `Member ${mid}`,
          description: '',
        })
      }
      circleMembers.push({
        id: `cm-${id}-${mid}`,
        orgId: 'org1',
        circleId: id,
        memberId: mid,
        createdAt: '',
        archived: false,
      })
    }
  }

  add('k0', null, false)
  add('k0.a', 'k0', false)
  add('k0.b', 'k0', false, ['km1', 'km2'])
  add('k0.b.rep', 'k0.b', true, ['km3'])

  return new OrgData({
    circles,
    circleMembers,
    circleLinks: [
      {
        id: 'cl1',
        orgId: 'org1',
        parentId: 'k0.a',
        circleId: 'k0.b',
        createdAt: '',
        archivedAt: null,
      } as any,
    ],
    roles,
    members,
    governanceMode: Governance_Mode_Enum.Strict,
  })
}

describe('invited roles', () => {
  const layout = computeLayout(buildLinkOrg(), CirclesGraphViews.Tree)
  const node = (id: string) => layout.nodes.find((n) => n.data.id === id)!

  it('lists the representatives of an invited role, not its members', () => {
    const linkCard = node('k0.a_k0.b')
    const rows = linkCard
      .descendants()
      .filter((n) => n.data.type === NodeType.Member)

    // One row for the representative, none for the members of the invited role
    expect(rows.map((n) => n.data.entityId)).toEqual(['km3'])
    // Listed as rows, so no avatar row on top of them
    expect(cardShowsLeaders(linkCard.data)).toBe(false)
    // Sized for its title and that one row
    expect(linkCard.h).toBeCloseTo(
      cardTitleHeight(linkCard.data) +
        graphSettings.tree.memberRowHeight +
        graphSettings.tree.cardPadding,
      5
    )

    // The invited role still lists its own members under its own card
    const invited = node('k0.b')
    expect(
      invited.descendants().filter((n) => n.data.type === NodeType.Member)
        .length
    ).toBe(3)
  })

  it('folds around the circle an invited role stands for', () => {
    const org = buildLinkOrg()
    // The invited role is selected under the id of its card
    for (const view of [CirclesGraphViews.Tree, CirclesGraphViews.Circles]) {
      const folded = computeLayout(org, view, true, 'k0.a_k0.b')
      const ids = folded.nodes
        .filter((n) => n.data.type === NodeType.Circle)
        .map((n) => n.data.id)

      // The invited circle, its ancestors and their children, not an empty view
      expect(ids).toContain('k0.b')
      expect(ids).toContain('k0')
      expect(ids).toContain('k0.a')
    }
  })

  it('draws the same representatives as avatars in the circles view', () => {
    const packed = computeLayout(buildLinkOrg(), CirclesGraphViews.Circles)
    const linkCircle = packed.nodes.find((n) => n.data.id === 'k0.a_k0.b')!

    expect(
      linkCircle.data.participants
        ?.filter((p) => p.leader)
        .map((p) => p.member.id)
    ).toEqual(['km3'])
    expect(cardShowsLeaders(linkCircle.data)).toBe(true)
  })
})

describe('getDropTargetNode', () => {
  const layout = computeLayout(buildParentLinkOrg(), CirclesGraphViews.Tree)
  const card = (id: string) => layout.nodes.find((n) => n.data.id === id)!

  it('sends a role dropped on a parent-link role to the circle it represents', () => {
    const dragged = card('p0.a')
    expect(getDropTargetNode(card('p0.link'), dragged)).toBe(card('p0'))
  })

  it('leaves a role dropped on a normal role alone', () => {
    const dragged = card('p0.a')
    expect(getDropTargetNode(card('p0.b'), dragged)).toBe(card('p0.b'))
  })

  it('assigns a member dropped on a parent-link role to it', () => {
    const memberOrg = computeLayout(buildOrg(1, 1, 1), CirclesGraphViews.Tree)
    const member = memberOrg.nodes.find((n) => n.data.type === NodeType.Member)!
    expect(getDropTargetNode(card('p0.link'), member)).toBe(card('p0.link'))
  })

  it('takes members on a members card, and sends roles to the role above it', () => {
    const membersCard = layout.nodes.find((n) => n.data.membersCard)!
    const member = layout.nodes.find((n) => n.data.type === NodeType.Member)!

    expect(getDropTargetNode(membersCard, member)).toBe(membersCard)
    expect(getDropTargetNode(membersCard, card('p0.a'))).toBe(card('p0'))
  })
})

// Root circle whose children hold wildly different numbers of members, each
// with children of its own: a level's cards end up at different heights
function buildUnevenTree(): OrgData {
  const circles: any[] = []
  const roles: any[] = []
  const members: any[] = []
  const circleMembers: any[] = []
  let memberIndex = 0

  const add = (id: string, parentId: string | null, memberCount: number) => {
    circles.push({
      id,
      orgId: 'org1',
      roleId: `role-${id}`,
      parentId,
      archived: false,
    })
    roles.push({
      id: `role-${id}`,
      base: false,
      name: `Role ${id}`,
      singleMember: false,
      parentLink: false,
      colorHue: null,
    })
    for (let k = 0; k < memberCount; k++) {
      const mid = `tm${memberIndex++}`
      members.push({
        id: mid,
        orgId: 'org1',
        archived: false,
        name: `Member ${mid}`,
        description: '',
      })
      circleMembers.push({
        id: `cm-${id}-${mid}`,
        orgId: 'org1',
        circleId: id,
        memberId: mid,
        createdAt: '',
        archived: false,
      })
    }
  }

  add('t0', null, 1)
  const counts = [1, 12, 2, 8, 1]
  counts.forEach((count, index) => {
    const id = `t0.${index}`
    add(id, 't0', count)
    add(`${id}.a`, id, count % 3)
    add(`${id}.b`, id, 1)
  })

  return new OrgData({
    circles,
    circleMembers,
    circleLinks: [],
    roles,
    members,
    governanceMode: Governance_Mode_Enum.Strict,
  })
}

describe('tree compaction', () => {
  const layout = computeLayout(buildUnevenTree(), CirclesGraphViews.Tree)
  const cards = layout.nodes.filter((n) => n.data.type === NodeType.Circle)

  it('never overlaps two cards', () => {
    for (let i = 0; i < cards.length; i++) {
      for (let j = i + 1; j < cards.length; j++) {
        const a = cards[i]
        const b = cards[j]
        const overlapX = Math.abs(a.x - b.x) < (a.w + b.w) / 2 - 0.001
        const overlapY = Math.abs(a.y - b.y) < (a.h + b.h) / 2 - 0.001
        expect(overlapX && overlapY).toBe(false)
      }
    }
  })

  it('lets a short branch rise above a tall one', () => {
    const tops = new Map<string, number>()
    for (const card of cards) tops.set(card.data.id, card.y - card.h / 2)

    // The children of the branch with 1 member sit higher than the children of
    // the branch with 12, instead of sharing one level line
    expect(tops.get('t0.0.a')!).toBeLessThan(tops.get('t0.1.a')!)
    // Siblings still share their top edge
    expect(tops.get('t0.0.a')!).toBeCloseTo(tops.get('t0.0.b')!, 5)
    expect(tops.get('t0.1.a')!).toBeCloseTo(tops.get('t0.1.b')!, 5)
  })
})

describe('hideMembers', () => {
  const org = buildOrg(2, 1, 3)

  it('leaves the members out and shrinks the cards that listed them', () => {
    const withMembers = computeLayout(org, CirclesGraphViews.Tree)
    const without = computeLayout(
      org,
      CirclesGraphViews.Tree,
      false,
      undefined,
      {
        hideMembers: true,
      }
    )

    expect(withMembers.nodes.some((n) => n.data.type === NodeType.Member)).toBe(
      true
    )
    expect(without.nodes.some((n) => n.data.type === NodeType.Member)).toBe(
      false
    )

    // Same cards, each only as tall as its title and its padding
    const cards = (layout: typeof withMembers) =>
      layout.nodes.filter((n) => n.data.type === NodeType.Circle)
    expect(cards(without).length).toBe(cards(withMembers).length)
    for (const card of cards(without)) {
      expect(card.h).toBeCloseTo(
        cardTitleHeight(card.data) + graphSettings.tree.cardPadding,
        5
      )
    }

    // And the chart is shorter overall
    const height = (layout: typeof withMembers) =>
      layout.bounds.y1 - layout.bounds.y0
    expect(height(without)).toBeLessThan(height(withMembers))
  })

  it('shrinks the packed circles too', () => {
    const withMembers = computeLayout(org, CirclesGraphViews.Circles)
    const without = computeLayout(
      org,
      CirclesGraphViews.Circles,
      false,
      undefined,
      { hideMembers: true }
    )

    expect(without.nodes.some((n) => n.data.type === NodeType.Member)).toBe(
      false
    )
    expect(without.root.r).toBeLessThan(withMembers.root.r)
  })
})

describe('minimap nodes', () => {
  // One root circle, then 3 circles per level over 3 levels: the levels hold
  // 1, 3, 9 and 27 circles, so their running totals are 1, 4, 13 and 40
  const layout = computeLayout(buildOrg(3, 3, 2), CirclesGraphViews.Circles)

  const depths = (nodes: typeof layout.nodes) =>
    [...new Set(nodes.map((node) => node.depth))].sort()

  it('draws the roles only, never the members', () => {
    const nodes = minimapNodes(layout.nodes, 1000)
    expect(nodes).toHaveLength(40)
    expect(nodes.every((node) => node.data.type === NodeType.Circle)).toBe(true)
  })

  it('keeps the levels whose running total holds in the budget', () => {
    expect(minimapNodes(layout.nodes, 13)).toHaveLength(13)
    expect(depths(minimapNodes(layout.nodes, 13))).toEqual([1, 2, 3])
  })

  it('drops a level whole rather than cutting into it', () => {
    expect(minimapNodes(layout.nodes, 12)).toHaveLength(4)
    expect(depths(minimapNodes(layout.nodes, 12))).toEqual([1, 2])
  })

  it('always draws the first level, however small the budget', () => {
    expect(minimapNodes(layout.nodes, 0)).toHaveLength(1)
  })
})
