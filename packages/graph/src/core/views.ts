import { CircleFragment } from '@rolebase/shared/gql'
import {
  CircleMemberJoined,
  OrgData,
} from '@rolebase/shared/model/OrgData'
import { Participant } from '@rolebase/shared/model/member'
import { HierarchyNode } from 'd3-hierarchy'
import uniqBy from 'lodash.uniqby'
import { CirclesGraphViews, Data, GraphEvents } from '../types'

// A render spec for a circle: which circle, where it sits in the layout, and
// what to render inside it. Replaces the nested CircleFull the views used to
// mutate.
export interface CircleData {
  id: string
  roleId: string
  parentId: string | null
  showMembers: boolean
  showLinks: boolean
  participants?: Participant[]
  // Explicit member entries to render (members view), overrides the circle's own
  memberEntries?: CircleMemberJoined[]
}

// A view determines which circles are displayed and how they are sorted
export interface ViewStrategy {
  getCircles(org: OrgData, selectedCircleId?: string): CircleData[]
  packSorting(a: HierarchyNode<Data>, b: HierarchyNode<Data>): number
  // Events disabled in this view
  omitEvents?: Array<keyof GraphEvents>
  // Recompute layout when the selected circle changes
  relayoutOnSelect?: boolean
}

// Stabilize sorting with ids
const sortById = (a: HierarchyNode<Data>, b: HierarchyNode<Data>) =>
  a.data.id.localeCompare(b.data.id)

const fullCircle = (
  id: string,
  roleId: string,
  parentId: string | null
): CircleData => ({ id, roleId, parentId, showMembers: true, showLinks: true })

const allCircles: ViewStrategy = {
  getCircles: (org) =>
    org.circles.map((c) => fullCircle(c.id, c.roleId, c.parentId ?? null)),
  packSorting: (a, b) =>
    // Sort by value
    (a.value || 0) - (b.value || 0) ||
    // Stabilize sorting with ids
    sortById(a, b),
}

// Subset of circles based on selected circle.
// Selected circle and all its parents are included with members.
// Direct children of those circles are included, with participants and no members.
const simpleCircles: ViewStrategy = {
  relayoutOnSelect: true,
  packSorting: sortById,
  getCircles(org, selectedCircleId) {
    // Get selected circle or root circle
    let circle: CircleFragment | undefined = org.circles.find((c) =>
      selectedCircleId ? c.id === selectedCircleId : c.parentId === null
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

// All circles in a flat array, with leaders
const flatCircle: ViewStrategy = {
  omitEvents: ['onCircleCopy', 'onCircleMove'],
  packSorting: sortById,
  getCircles: (org) =>
    org.circles
      .filter((circle) => !org.roleById.get(circle.roleId)?.base)
      .map(
        (circle): CircleData => ({
          id: circle.id,
          roleId: circle.roleId,
          parentId: null,
          showMembers: false,
          showLinks: false,
          participants: org.getParticipants(circle.id),
        })
      ),
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

export const viewStrategies: Record<CirclesGraphViews, ViewStrategy> = {
  [CirclesGraphViews.AllCircles]: allCircles,
  [CirclesGraphViews.SimpleCircles]: simpleCircles,
  [CirclesGraphViews.FlatCircle]: flatCircle,
  [CirclesGraphViews.Members]: members,
}
