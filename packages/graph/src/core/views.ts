import { CircleFullFragment } from '@rolebase/shared/gql'
import { getCircleParticipants } from '@rolebase/shared/helpers/getCircleParticipants'
import { Participant } from '@rolebase/shared/model/member'
import { HierarchyNode } from 'd3-hierarchy'
import uniqBy from 'lodash.uniqby'
import { CirclesGraphViews, Data, GraphEvents } from '../types'

export interface CircleData extends CircleFullFragment {
  participants?: Participant[]
}

// A view determines which circles are displayed and how they are sorted
export interface ViewStrategy {
  getCircles(
    circles: CircleFullFragment[],
    selectedCircleId?: string
  ): CircleData[]
  packSorting(a: HierarchyNode<Data>, b: HierarchyNode<Data>): number
  // Events disabled in this view
  omitEvents?: Array<keyof GraphEvents>
  // Recompute layout when the selected circle changes
  relayoutOnSelect?: boolean
}

// Stabilize sorting with ids
const sortById = (a: HierarchyNode<Data>, b: HierarchyNode<Data>) =>
  a.data.id.localeCompare(b.data.id)

const allCircles: ViewStrategy = {
  getCircles: (circles) => circles,
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
  getCircles(circles, selectedCircleId) {
    // Get selected circle or root circle
    let circle = circles.find((c) =>
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
      const children = circles.filter((c) => c.parentId === circle?.id)
      result.push(
        ...children.map((c) =>
          c.id === prevCircleId
            ? c
            : {
                ...c,
                members: [],
                invitedCircleLinks: [],
                participants: getCircleParticipants(c.id, circles),
              }
        )
      )

      const parent = circles.find((c) => c.id === circle?.parentId)
      // Add root circle
      if (!parent) {
        result.push(circle)
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
  getCircles: (circles) =>
    circles
      .filter((circle) => !circle.role.base)
      .map((circle) => ({
        ...circle,
        parentId: null,
        members: [],
        invitedCircleLinks: [],
        participants: getCircleParticipants(circle.id, circles),
      })),
}

// Root circle with all unique members
const members: ViewStrategy = {
  omitEvents: ['onCircleCopy', 'onCircleMove'],
  packSorting: sortById,
  getCircles(circles) {
    const rootCircle = circles.find((c) => c.parentId === null)
    if (!rootCircle) return []

    // Find all unique members from circles
    const allMembers = uniqBy(
      circles.flatMap((circle) => circle.members),
      'member.id'
    )

    return [
      {
        ...rootCircle,
        members: allMembers,
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
