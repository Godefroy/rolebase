import { Participant } from '@rolebase/shared/model/member'
import { BaseType, HierarchyNode, Selection } from 'd3'

export { CirclesGraphViews } from '@rolebase/shared/model/graph'

export type GraphColorMode = 'light' | 'dark'

export interface GraphParams {
  width: number
  height: number
  colorMode: GraphColorMode
  zoomDisabled?: boolean
  // Show members and deep circles at any zoom scale (e.g. export)
  showAllNodes?: boolean
  // Members are not rendered at all: they are left out of the layout, so a
  // card or a circle is only as big as what it actually shows
  hideMembers?: boolean
  focusCircleScale?: (node: NodeData) => number
  focusCrop?: Position
  events: GraphEvents
}

export type RootElement = HTMLDivElement

export enum NodeType {
  Circle = 'Circle',
  MembersCircle = 'MembersCircle',
  Member = 'Member',
}

// How a view places its nodes. Each layout produces the same node geometry,
// so culling, drag & drop, zoom and rendering work the same for both.
export enum GraphLayoutKind {
  // Circle packing: children are strictly inside their parent
  Pack = 'Pack',
  // Top-down tree of cards: children are below their parent, linked by edges
  Tree = 'Tree',
}

export enum NodeShape {
  Circle = 'Circle',
  Rect = 'Rect',
}

// Axis-aligned bounding box, in layout coordinates
export interface Bounds {
  x0: number
  y0: number
  x1: number
  y1: number
}

// Geometry of a laid out node, whatever the layout that produced it.
// A circle node has w = h = 2r; a rect node keeps r as its circumradius, so
// every radius-based computation (zoom fit, pan extent, screen-size culling)
// keeps working unchanged.
export interface NodeGeometry {
  x: number
  y: number
  r: number
  w: number
  h: number
  shape: NodeShape
  // Bounding box of the node subtree. In a pack layout it is the node's own
  // box (children are contained); in a tree layout it covers the descendants
  // laid out below. Culling bails out on it instead of relying on containment.
  bounds: Bounds
}

// d3 declares x and y as optional on a plain hierarchy node (only a laid out
// node has them). Every node here comes out of a layout, so they are required.
export interface NodeData extends HierarchyNode<Data>, NodeGeometry {
  x: number
  y: number
}

// An edge from a parent card to a child card, in the hierarchical views.
// Its geometry only depends on the layout, so the path is built once.
export interface TreeLink {
  // Id of the child node the edge leads to
  id: string
  // SVG path, in layout coordinates
  path: string
  // Bounding box of the path
  bounds: Bounds
  // Radius of the child card, for the on-screen size culling
  r: number
}

// What a layout pass needs beyond the org data and the view
export interface LayoutOptions {
  // Leave the members out: cards and circles are sized without them
  hideMembers?: boolean
}

// Result of a layout pass: everything the graph needs to render, cull, zoom
// and pan, whatever the layout that produced it.
export interface Layout {
  // Artificial root node enclosing the whole layout
  root: NodeData
  // All nodes under root (without root), sorted by depth
  nodes: NodeData[]
  kind: GraphLayoutKind
  // Bounding box of the whole layout
  bounds: Bounds
  // Center and radius framing the whole layout (initial zoom, export)
  focus: { x: number; y: number; r: number }
  // Box framing the whole layout. A tree is much wider than it is tall, so it
  // is fitted to both viewport dimensions instead of a single radius.
  focusBox: Bounds
  // Radius driving the pan extent
  panRadius: number
  // Edges between cards (empty in a pack layout)
  links: TreeLink[]
}

export type NodesSelection = Selection<SVGGElement, NodeData, BaseType, unknown>

export interface Data {
  id: string
  entityId?: string
  parentId?: string | null
  name: string
  picture?: string | null
  type: NodeType
  colorHue?: number
  // Role representing its circle to the parent circle ("Leader",
  // "Représentant"): stacked under its parent rather than laid out beside its
  // siblings in the hierarchical views
  parentLink?: boolean
  value?: number
  children?: Array<Data>
  participants?: readonly Participant[]
}

export interface GraphEvents {
  onCircleClick?(circleId: string, parentId?: string): void
  // Move handlers return whether the move was applied: the graph keeps the node
  // at its new place (true) or resets the drag (false, e.g. refused by
  // permissions). Backend rejections throw and are treated as not moved too.
  onCircleMove?(
    circleId: string,
    targetCircleId: string | null
  ): Promise<boolean>
  onCircleCopy?(
    circleId: string,
    targetCircleId: string | null
  ): Promise<string | undefined>
  onMemberClick?(circleId: string, memberId: string): void
  onMemberMove?(
    memberId: string,
    parentCircleId: string,
    targetCircleId: string | null
  ): Promise<boolean>
  onMemberAdd?(memberId: string, targetCircleId: string): Promise<boolean>
  onClickOutside?(): void
}

export type ZoomFocusCircleScale = (node: NodeData) => number

export interface Position {
  top: number
  right: number
  bottom: number
  left: number
}

// Discrete visibility of a circle title at the culling-pass zoom scale.
// Computed in the culling pass (not per frame from --zoom-scale) so titles
// never recomposite during a gesture. center and top are mutually exclusive.
export interface TitleVisibility {
  // Big centered title, shown when the circle is small on screen (low zoom)
  center: boolean
  // Small label above the circle, shown when it is big enough on screen
  top: boolean
}

// Result of the culling pass: nodes and titles to mount in the DOM
export interface VisibleNodes {
  nodes: NodeData[]
  titles: NodeData[]
  // Edges to mount in the DOM. They are culled on their own bounding box, not
  // on their endpoints: an edge crossing the viewport stays visible even when
  // both cards it links are off screen.
  links: TreeLink[]
  // Discrete title visibility, keyed by node id (see TitleVisibility)
  titleVisibility: Map<string, TitleVisibility>
  // Zoom scale at the moment of this culling pass. Titles read it (as a plain
  // number that only changes between culls) to keep the top label roughly
  // constant on screen, instead of the per-frame --zoom-scale CSS variable.
  cullScale: number
  // Nodes inside a circle that displays its centered title:
  // faded out and click-through
  levelHiddenIds: Set<string>
  // Zoom scales at which the culling must be recomputed
  // (visibility thresholds of children of visible circles)
  criticalScales: number[]
}
