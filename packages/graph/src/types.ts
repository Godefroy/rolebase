import { Participant } from '@rolebase/shared/model/member'
import { BaseType, HierarchyCircularNode, Selection } from 'd3'

export { CirclesGraphViews } from '@rolebase/shared/model/graph'

export type GraphColorMode = 'light' | 'dark'

export interface GraphParams {
  width: number
  height: number
  colorMode: GraphColorMode
  zoomDisabled?: boolean
  // Show members and deep circles at any zoom scale (e.g. export)
  showAllNodes?: boolean
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

export type NodeData = HierarchyCircularNode<Data>
export type NodesSelection = Selection<SVGGElement, NodeData, BaseType, unknown>

export interface Data {
  id: string
  entityId?: string
  parentId?: string | null
  name: string
  picture?: string | null
  type: NodeType
  colorHue?: number
  value?: number
  children?: Array<Data>
  participants?: readonly Participant[]
}

export interface GraphEvents {
  onCircleClick?(circleId: string, parentId?: string): void
  // Move handlers return whether the move was applied: the graph keeps the node
  // at its new place (true) or resets the drag (false, e.g. refused by
  // permissions). Backend rejections throw and are treated as not moved too.
  onCircleMove?(circleId: string, targetCircleId: string | null): Promise<boolean>
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
