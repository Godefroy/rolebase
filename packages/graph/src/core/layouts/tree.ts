import * as d3 from 'd3'
import settings from '../../settings'
import {
  Bounds,
  Data,
  GraphLayoutKind,
  Layout,
  NodeData,
  NodeShape,
  NodeType,
  TreeLink,
} from '../../types'

const t = settings.tree

// Width of a member row inside a card, and of a wrapped title
const memberRowWidth = t.cardWidth - 2 * t.cardPadding

// The layout must stay pure (it runs on the server too), so a title is
// measured from the character classes it is made of rather than from the DOM:
// in a sans-serif an 'i' is about a third of an 'm'. The estimate carries a
// safety factor, and the title is clamped in CSS to the line count it yields,
// so a name it still falls short on ellipsizes rather than overflowing.
const NARROW_CHARS = " iIlj|.,:;'`!/\\()[]{}-"
const WIDE_CHARS = 'mwMW@%'

function charWidth(char: string): number {
  if (NARROW_CHARS.includes(char)) return 0.32
  if (WIDE_CHARS.includes(char)) return 0.85
  if (char >= 'A' && char <= 'Z') return 0.62
  return 0.53
}

function textWidth(text: string): number {
  let width = 0
  for (const char of text) width += charWidth(char)
  return width * t.titleFontSize * t.titleWidthSafety
}

// Lines a wrapped title takes, capped so one pathological name cannot stretch
// a whole level of the chart
export function titleLineCount(name: string): number {
  const words = name.split(/\s+/).filter(Boolean)
  if (words.length === 0) return 1

  const spaceWidth = textWidth(' ')
  let lines = 1
  let used = 0

  for (const word of words) {
    const width = textWidth(word)

    // A word wider than a line wraps inside itself
    if (width > memberRowWidth) {
      if (used > 0) lines++
      const ownLines = Math.ceil(width / memberRowWidth)
      lines += ownLines - 1
      used = width - (ownLines - 1) * memberRowWidth
      continue
    }

    const needed = used === 0 ? width : used + spaceWidth + width
    if (needed > memberRowWidth) {
      lines++
      used = width
    } else {
      used = needed
    }
  }

  return Math.min(lines, t.titleMaxLines)
}

// Height of the title block of a card
export function cardTitleHeight(name: string): number {
  return 2 * t.cardTitlePadding + titleLineCount(name) * t.titleLineHeight
}

// A card lists its members, and falls back to its leaders when it has none
export function cardShowsLeaders(data: Data): boolean {
  return (
    memberChildren(data).length === 0 &&
    !!data.participants?.some((participant) => participant.leader)
  )
}

// Circle children that take a slot in the level below. A parent-link card
// stacks under the card it represents instead, so the horizontal packing
// descends straight through it.
function levelChildren(data: Data): Data[] {
  const children: Data[] = []
  for (const child of data.children ?? []) {
    if (child.type !== NodeType.Circle) continue
    if (child.parentLink) children.push(...levelChildren(child))
    else children.push(child)
  }
  return children
}

// Gap above a card of a stack. Only the first one is set apart from the card
// it hangs under; the rest are barely separated, so a stack reads as one block.
function stackGap(parent: Data, index: number): number {
  return parent.parentLink || index > 0 ? t.stackInnerGapY : t.stackGapY
}

// Cards that hang one level below this one, descending through the stacked
// parent-link cards
function levelChildNodes(node: NodeData): NodeData[] {
  const children: NodeData[] = []
  for (const child of (node.children ?? []) as NodeData[]) {
    if (child.data.type !== NodeType.Circle) continue
    if (child.data.parentLink) children.push(...levelChildNodes(child))
    else children.push(child)
  }
  return children
}

// Top-down tree of cards, linked by edges (classic org chart).
// Cards share one width and one font size, so the layout stays readable
// whatever the depth. Their height grows with the members they list, one row
// each, and each level is as tall as its tallest card plus the tallest stack
// of parent-link cards hanging from it.
export function computeTreeLayout(data: Data): Layout {
  // Full hierarchy: cards, member groups and members
  const root = d3.hierarchy(data) as unknown as NodeData

  // Cards-only hierarchy, the one d3.tree lays out
  const cardRoot = d3.hierarchy(data, levelChildren)
  cardRoot.sort(
    (a, b) =>
      a.data.name.localeCompare(b.data.name) ||
      a.data.id.localeCompare(b.data.id)
  )

  // Uniform horizontal step; the vertical placement is done below, so d3 only
  // decides the horizontal packing. It keeps cards of the same level apart,
  // which is what makes the compaction pass safe.
  const pointRoot = d3
    .tree<Data>()
    .nodeSize([t.cardWidth + t.gapX, 1])
    .separation((a, b) => (a.parent === b.parent ? 1 : t.subtreeSeparation))(
    cardRoot
  )

  const positions = new Map<string, number>()
  pointRoot.each((node) => positions.set(node.data.id, node.x))

  // Size every card and set its horizontal position. Parent-link cards take
  // their parent's, when their stack is placed below.
  root.each((hierarchyNode) => {
    const node = hierarchyNode as NodeData
    if (node.data.type !== NodeType.Circle) return

    const isRoot = node.data.id === 'root'
    node.w = isRoot ? 0 : t.cardWidth
    node.h = isRoot ? 0 : cardHeight(node.data)
    node.r = Math.hypot(node.w, node.h) / 2
    node.shape = NodeShape.Rect
    node.x = positions.get(node.data.id) ?? 0
    node.y = 0
  })

  // Hang the parent-link cards under the card they represent, one below
  // another. Returns the bottom of the stack.
  const placeStack = (card: NodeData): number => {
    let bottom = card.y + card.h / 2
    let index = 0
    for (const child of (card.children ?? []) as NodeData[]) {
      if (child.data.type !== NodeType.Circle || !child.data.parentLink)
        continue
      child.x = card.x
      child.y = bottom + stackGap(card.data, index) + child.h / 2
      bottom = placeStack(child)
      index++
    }
    return bottom
  }

  // Place the cards group of siblings by group of siblings, breadth-first.
  // A group shares one top edge, and only has to clear the cards it actually
  // overlaps horizontally rather than the tallest card of its level: one role
  // with many members no longer pushes the whole chart down. d3 keeps cards of
  // the same level apart horizontally, so a group can only ever collide with a
  // card of a shallower level, and those are all placed before it.
  const placed: Array<{ x0: number; x1: number; bottom: number }> = []

  const placeGroup = (cards: NodeData[], minTop: number) => {
    let x0 = Infinity
    let x1 = -Infinity
    for (const card of cards) {
      x0 = Math.min(x0, card.x - card.w / 2)
      x1 = Math.max(x1, card.x + card.w / 2)
    }

    let top = minTop
    for (const box of placed) {
      if (box.x1 > x0 && box.x0 < x1) {
        top = Math.max(top, box.bottom + t.gapY)
      }
    }

    for (const card of cards) {
      card.y = top + card.h / 2
      placed.push({
        x0: card.x - card.w / 2,
        x1: card.x + card.w / 2,
        bottom: placeStack(card),
      })
    }
  }

  let generation: NodeData[] = [root]
  while (generation.length !== 0) {
    const next: NodeData[] = []
    for (const card of generation) {
      const children = levelChildNodes(card)
      if (children.length === 0) continue
      const bottom = stackBottom(card)
      placeGroup(
        children,
        card.data.id === 'root' ? 0 : bottom.y + bottom.h / 2 + t.gapY
      )
      next.push(...children)
    }
    generation = next
  }

  // Finally place the member rows, now that every card has its position
  root.each((hierarchyNode) => {
    const node = hierarchyNode as NodeData

    switch (node.data.type) {
      case NodeType.MembersCircle: {
        const card = node.parent as NodeData | null
        const members = (node.children ?? []) as NodeData[]
        const step = t.memberRowHeight + t.memberRowGap
        const top = card
          ? card.y - card.h / 2 + cardTitleHeight(card.data.name)
          : 0

        // One row per member, spanning the card width
        members.forEach((member, index) => {
          member.x = card?.x ?? 0
          member.y = top + t.memberRowHeight / 2 + index * step
          member.w = memberRowWidth
          member.h = t.memberRowHeight
          member.r = Math.hypot(member.w, member.h) / 2
          member.shape = NodeShape.Rect
        })

        // Invisible group node: it must cover the rows area, otherwise the
        // culling pass would drop it (and its members) before they are tested
        const rowsHeight = membersHeight(members.length)
        node.x = card?.x ?? 0
        node.y = rowsHeight > 0 ? top + rowsHeight / 2 : card?.y ?? 0
        node.w = card?.w ?? 0
        node.h = rowsHeight > 0 ? rowsHeight : card?.h ?? 0
        node.r = Math.hypot(node.w, node.h) / 2
        node.shape = NodeShape.Circle
        return
      }

      default:
        // Cards are placed above; a member is placed with its member group
        return
    }
  })

  // Subtree bounds, bottom-up. In a tree the children sit outside their
  // parent, so this is what the culling pass bails out on.
  root.eachAfter((hierarchyNode) => {
    const node = hierarchyNode as NodeData
    const children = (node.children ?? []) as NodeData[]
    const isRoot = node.data.id === 'root'
    let bounds: Bounds =
      isRoot && children.length !== 0
        ? { ...children[0].bounds }
        : ownBounds(node)
    for (const child of children) {
      bounds = {
        x0: Math.min(bounds.x0, child.bounds.x0),
        y0: Math.min(bounds.y0, child.bounds.y0),
        x1: Math.max(bounds.x1, child.bounds.x1),
        y1: Math.max(bounds.y1, child.bounds.y1),
      }
    }
    node.bounds = bounds
  })

  const bounds = root.bounds
  const width = bounds.x1 - bounds.x0
  const height = bounds.y1 - bounds.y0

  // The root stands for the whole layout: framing it fits the entire tree
  root.x = (bounds.x0 + bounds.x1) / 2
  root.y = (bounds.y0 + bounds.y1) / 2
  root.w = width
  root.h = height
  root.r = Math.max(width, height) / 2

  const nodes = root
    .descendants()
    .slice(1)
    .sort((a, b) => a.depth - b.depth)

  return {
    root,
    nodes,
    kind: GraphLayoutKind.Tree,
    bounds,
    focus: { x: root.x, y: root.y, r: root.r },
    focusBox: bounds,
    links: buildLinks(nodes),
  }
}

// Card an edge starts from. A card on a level hangs from the bottom of the
// stack of parent-link cards under its parent, not from the parent itself; a
// stacked card hangs from whatever sits directly above it in the stack.
function linkSource(node: NodeData, parent: NodeData): NodeData {
  if (!node.data.parentLink) return stackBottom(parent)

  const stack = ((parent.children ?? []) as NodeData[]).filter(
    (child) => child.data.type === NodeType.Circle && child.data.parentLink
  )
  const index = stack.indexOf(node)
  return index > 0 ? stackBottom(stack[index - 1]) : parent
}

// Lowest card of the stack hanging from a card, or the card itself
function stackBottom(node: NodeData): NodeData {
  let lowest = node
  const visit = (card: NodeData) => {
    for (const child of (card.children ?? []) as NodeData[]) {
      if (child.data.type !== NodeType.Circle || !child.data.parentLink)
        continue
      if (child.y + child.h / 2 > lowest.y + lowest.h / 2) lowest = child
      visit(child)
    }
  }
  visit(node)
  return lowest
}

// Edges from each card to the card it hangs from. Their geometry only depends
// on the layout, so the paths are built once here and culled on their bounds.
function buildLinks(nodes: NodeData[]): TreeLink[] {
  const links: TreeLink[] = []

  for (const node of nodes) {
    if (node.data.type !== NodeType.Circle) continue
    const parent = node.parent as NodeData | null
    if (!parent || parent.data.type !== NodeType.Circle) continue
    if (parent.data.id === 'root') continue

    const source = linkSource(node, parent)
    // Cards of a stack are flush against each other: no edge to draw
    if (node.data.parentLink && source.data.parentLink) continue

    const sourceY = source.y + source.h / 2
    const childY = node.y - node.h / 2

    links.push({
      id: node.data.id,
      path: linkPath(source.x, sourceY, node.x, childY),
      bounds: {
        x0: Math.min(source.x, node.x),
        y0: sourceY,
        x1: Math.max(source.x, node.x),
        y1: childY,
      },
      r: node.r,
    })
  }

  return links
}

// Orthogonal elbow with rounded corners, from a parent card to a child card
function linkPath(
  parentX: number,
  parentY: number,
  childX: number,
  childY: number
): string {
  const middleY = (parentY + childY) / 2
  const deltaX = childX - parentX

  if (Math.abs(deltaX) < 1) {
    return `M${parentX},${parentY} V${childY}`
  }

  const direction = deltaX > 0 ? 1 : -1
  const radius = Math.min(
    t.cardRadius * 2,
    Math.abs(deltaX) / 2,
    Math.abs(middleY - parentY),
    Math.abs(childY - middleY)
  )

  return [
    `M${parentX},${parentY}`,
    `V${middleY - radius}`,
    `Q${parentX},${middleY} ${parentX + direction * radius},${middleY}`,
    `H${childX - direction * radius}`,
    `Q${childX},${middleY} ${childX},${middleY + radius}`,
    `V${childY}`,
  ].join(' ')
}

function ownBounds(node: NodeData): Bounds {
  return {
    x0: node.x - node.w / 2,
    y0: node.y - node.h / 2,
    x1: node.x + node.w / 2,
    y1: node.y + node.h / 2,
  }
}

// Members a card displays, in data order
function memberChildren(data: Data): Data[] {
  const membersCircle = data.children?.find(
    (child) => child.type === NodeType.MembersCircle
  )
  return membersCircle?.children ?? []
}

// Height of a stack of member rows
function membersHeight(count: number): number {
  return count > 0
    ? count * t.memberRowHeight + (count - 1) * t.memberRowGap
    : 0
}

// A card holds a title, then either its members or its leaders
export function cardHeight(data: Data): number {
  const title = cardTitleHeight(data.name)
  const members = memberChildren(data)
  if (members.length !== 0) {
    return title + membersHeight(members.length) + t.cardPadding
  }
  if (cardShowsLeaders(data)) {
    return title + 2 * t.leaderRadius + t.cardPadding
  }
  return title + t.cardPadding
}
