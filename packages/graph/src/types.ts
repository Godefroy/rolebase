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
  participants?: Participant[]
}

export interface GraphEvents {
  onCircleClick?(circleId: string, parentId?: string): void
  onCircleMove?(circleId: string, targetCircleId: string | null): Promise<void>
  onCircleCopy?(
    circleId: string,
    targetCircleId: string | null
  ): Promise<string | undefined>
  onMemberClick?(circleId: string, memberId: string): void
  onMemberMove?(
    memberId: string,
    parentCircleId: string,
    targetCircleId: string | null
  ): Promise<void>
  onMemberAdd?(memberId: string, targetCircleId: string): Promise<void>
  onClickOutside?(): void
}

export type ZoomFocusCircleScale = (node: NodeData) => number

export interface Position {
  top: number
  right: number
  bottom: number
  left: number
}

// Result of the culling pass: nodes and titles to mount in the DOM
export interface VisibleNodes {
  nodes: NodeData[]
  titles: NodeData[]
  // Nodes inside a circle that displays its centered title:
  // faded out and click-through
  levelHiddenIds: Set<string>
  // Zoom scales at which the culling must be recomputed
  // (visibility thresholds of children of visible circles)
  criticalScales: number[]
}
