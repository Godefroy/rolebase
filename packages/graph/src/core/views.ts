import { CircleFragment } from '@rolebase/shared/gql'
import { CircleMemberJoined, OrgData } from '@rolebase/shared/model/OrgData'
import { Participant } from '@rolebase/shared/model/member'
import { HierarchyNode } from 'd3-hierarchy'
import uniqBy from 'lodash.uniqby'
import { CirclesGraphViews, Data, GraphEvents, GraphLayoutKind } from '../types'

// A render spec for a circle: which circle, where it sits in the layout, and
// what to render inside it. Replaces the nested CircleFull the views used to
// mutate.
export interface CircleData {
  id: string
  roleId: string
  parentId: string | null
  showMembers: boolean
  showLinks: boolean
  participants?: readonly Participant[]
  // Explicit member entries to render (members view), overrides the circle's own
  memberEntries?: CircleMemberJoined[]
}

// A view determines which circles are displayed, how they are placed and
// how they are sorted
export interface ViewStrategy {
  getCircles(org: OrgData, selectedCircleId?: string): CircleData[]
  // How the circles are placed (defaults to circle packing)
  layout?: GraphLayoutKind
  // Circle packing only: order of the packed siblings
  packSorting?(a: HierarchyNode<Data>, b: HierarchyNode<Data>): number
  // Events disabled in this view
  omitEvents?: Array<keyof GraphEvents>
  // Recompute layout when the selected circle changes
  relayoutOnSelect?: boolean
}

// Stabilize sorting with ids
export const sortById = (a: HierarchyNode<Data>, b: HierarchyNode<Data>) =>
  a.data.id.localeCompare(b.data.id)

// Circle a selected node stands for. An invited role is selected under the id
// of its card, "<invitingCircleId>_<circleId>": it stands for the circle it
// invites, which is where a folded view has to open.
export function selectedCircleOf(nodeId?: string): string | undefined {
  return nodeId?.split('_').pop()
}

const fullCircle = (
  id: string,
  roleId: string,
  parentId: string | null
): CircleData => ({ id, roleId, parentId, showMembers: true, showLinks: true })

const circles: ViewStrategy = {
  getCircles: (org) =>
    org.circles.map((c) => fullCircle(c.id, c.roleId, c.parentId ?? null)),
  packSorting: (a, b) =>
    // Sort by value
    (a.value || 0) - (b.value || 0) ||
    // Stabilize sorting with ids
    sortById(a, b),
}

// Circles folded around the selected circle.
// Selected circle and all its parents are included with members.
// Direct children of those circles are included, with participants and no members.
const foldedCircles: ViewStrategy = {
  relayoutOnSelect: true,
  packSorting: sortById,
  getCircles(org, selectedCircleId) {
    // Get selected circle or root circle
    const circleId = selectedCircleOf(selectedCircleId)
    let circle: CircleFragment | undefined = org.circles.find((c) =>
      circleId ? c.id === circleId : c.parentId === null
    )
    if (!circle) {
      console.error('Circle not found')
      return []
    }
    const result: CircleData[] = []
    let prevCircleId: string | undefined

    while (circle) {
      // Add circle children
      const children = org.circles.filter((c) => c.parentId === circle?.id)
      result.push(
        ...children.map(
          (c): CircleData =>
            c.id === prevCircleId
              ? fullCircle(c.id, c.roleId, c.parentId ?? null)
              : {
                  id: c.id,
                  roleId: c.roleId,
                  parentId: c.parentId ?? null,
                  showMembers: false,
                  showLinks: false,
                  participants: org.getParticipants(c.id),
                }
        )
      )

      const parent: CircleFragment | undefined = circle.parentId
        ? org.circleById.get(circle.parentId)
        : undefined
      // Add root circle
      if (!parent) {
        result.push(
          fullCircle(circle.id, circle.roleId, circle.parentId ?? null)
        )
      }
      prevCircleId = circle.id
      circle = parent
    }
    return result
  },
}

// Root circle with all unique members
const members: ViewStrategy = {
  omitEvents: ['onCircleCopy', 'onCircleMove'],
  packSorting: sortById,
  getCircles(org) {
    const rootCircle = org.circles.find((c) => c.parentId === null)
    if (!rootCircle) return []

    // Find all unique members from circles
    const allMembers = uniqBy(
      org.circles.flatMap((circle) => org.membersOf(circle.id)),
      'member.id'
    )

    return [
      {
        id: rootCircle.id,
        roleId: rootCircle.roleId,
        parentId: rootCircle.parentId ?? null,
        showMembers: true,
        showLinks: false,
        memberEntries: allMembers,
      },
    ]
  },
}

// Same circles as the circles view, laid out as a top-down tree of cards
const tree: ViewStrategy = {
  layout: GraphLayoutKind.Tree,
  getCircles: circles.getCircles,
}

// Same circles as the folded circles view (the selected circle, its ancestors
// and their direct children), laid out as a top-down tree of cards. Every card
// lists its members: a card is read as a whole, so a role on screen always
// shows who fills it, not just who represents it.
const foldedTree: ViewStrategy = {
  layout: GraphLayoutKind.Tree,
  relayoutOnSelect: true,
  getCircles: (org, selectedCircleId) =>
    foldedCircles.getCircles(org, selectedCircleId).map((circle) => ({
      ...circle,
      showMembers: true,
      participants: undefined,
    })),
}

// A view and its folding flag decide the strategy. The members view shows the
// whole organization by definition, so folding it means nothing.
export function getViewStrategy(
  view: CirclesGraphViews,
  folded?: boolean
): ViewStrategy {
  if (view === CirclesGraphViews.Members) return members
  if (view === CirclesGraphViews.Tree) return folded ? foldedTree : tree
  return folded ? foldedCircles : circles
}
