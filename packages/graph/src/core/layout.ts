import { CircleFullFragment } from '@rolebase/shared/gql'
import { getCircleParticipants } from '@rolebase/shared/helpers/getCircleParticipants'
import { truthy } from '@rolebase/shared/helpers/truthy'
import * as d3 from 'd3'
import { resizedImageUrl } from '../helpers/resizedImageUrl'
import { textEllipsis } from '../helpers/textEllipsis'
import settings from '../settings'
import { CirclesGraphViews, Data, NodeData, NodeType } from '../types'
import { CircleData, viewStrategies } from './views'

export interface Layout {
  // Artificial root node enclosing all circles
  root: NodeData
  // All nodes under root (without root), sorted by depth
  nodes: NodeData[]
}

// Compute the circle packing layout of circles for a given view.
// Pure: usable in browser and server.
export function computeLayout(
  circles: CircleFullFragment[],
  view: CirclesGraphViews,
  selectedCircleId?: string
): Layout {
  const strategy = viewStrategies[view]
  const data = prepareData(
    strategy.getCircles(circles, selectedCircleId),
    circles
  )

  // Pack data with d3.pack
  const root = packData(data, strategy.packSorting)

  // Get all nodes under root and rescale them
  const nodesMap = root.descendants()
  const minRadius = nodesMap.reduce(
    (min, node) => (node.r < min ? node.r : min),
    Infinity
  )
  const nodeScale = 30 / minRadius
  for (const node of nodesMap) {
    node.r *= nodeScale
    node.x *= nodeScale
    node.y *= nodeScale
  }

  return { root, nodes: nodesMap.slice(1) }
}

function prepareData(
  circles: CircleData[],
  origCircles: CircleFullFragment[]
): Data {
  return {
    id: 'root',
    parentId: null,
    type: NodeType.Circle,
    name: '',
    children: prepareDataInternal(circles, origCircles, null),
  }
}

function prepareDataInternal(
  circles: CircleData[],
  origCircles: CircleFullFragment[],
  parentId: string | null = null
): Data[] {
  return circles
    .filter((circle) => circle.parentId == parentId)
    .map((circle) => {
      // Define circle data with role name
      const data: Data = {
        id: circle.id,
        entityId: circle.id,
        parentId: circle.parentId,
        name: circle.role.name,
        type: NodeType.Circle,
        colorHue: circle.role.colorHue ?? undefined,
      }

      // Add sub-circles to children
      const children: Data[] = prepareDataInternal(
        circles,
        origCircles,
        circle.id
      )

      // Add circle links
      if (circle.invitedCircleLinks.length !== 0) {
        children.push(...circleLinksToData(circle, origCircles))
      }

      // Add members in a circle to group them
      if (circle.members.length !== 0 || children.length === 0) {
        children.push(membersToData(circle, data.colorHue))
      }

      // Set children if there is at least one
      if (children.length !== 0) {
        data.children = children
      }

      if (circle.participants) {
        data.participants = circle.participants
      }

      return data
    })
}

function membersToData(circle: CircleFullFragment, colorHue?: number): Data {
  const node: Data = {
    id: `${circle.id}-members`,
    parentId: circle.id,
    name: '',
    type: NodeType.MembersCircle,
  }
  if (circle.members.length !== 0) {
    node.children = circle.members.map(
      (entry): Data => ({
        id: entry.id,
        entityId: entry.member.id,
        parentId: circle.id,
        name: textEllipsis(entry.member.name, 20),
        picture: resizedImageUrl(entry.member.picture, settings.avatarWidth),
        type: NodeType.Member,
        colorHue,
      })
    )
  }
  return node
}

function circleLinksToData(
  circle: CircleFullFragment,
  circles: CircleFullFragment[]
): Data[] {
  return circle.invitedCircleLinks
    .map(({ invitedCircle: { id } }): Data | undefined => {
      const invitedCircle = circles.find((c) => c.id === id)
      if (!invitedCircle) return

      const colorHue =
        invitedCircle.role.colorHue ?? circle.role.colorHue ?? undefined
      const participants = getCircleParticipants(invitedCircle, circles)

      return {
        id: `${circle.id}_${id}`,
        entityId: id,
        parentId: circle.id,
        name: invitedCircle.role.name,
        type: NodeType.Circle,
        colorHue,
        participants,
        // Add empty children for padding
        children: [
          {
            id: `${circle.id}_${id}-members`,
            parentId: circle.id,
            name: '',
            type: NodeType.MembersCircle,
          },
        ],
      }
    })
    .filter(truthy)
}

function packData(
  data: Data,
  packSorting: (a: d3.HierarchyNode<Data>, b: d3.HierarchyNode<Data>) => number
) {
  const hierarchyNode = d3
    .hierarchy(data)
    .sum((d) => d.value || 0)
    .sort(packSorting)

  return (
    d3
      .pack<Data>()
      .radius(() => settings.memberValue)
      .padding((d) => {
        // Circle
        if (d.data.type === NodeType.Circle) {
          const hasSubCircles = d.data.children?.some(
            (c) => c.type === NodeType.Circle
          )
          if (!hasSubCircles) return settings.padding.circleWithoutSubCircle
          const multipleChildren = (d.data.children?.length || 0) > 1
          return multipleChildren
            ? settings.padding.circleWithSubCircles
            : settings.padding.circleWithSingleSubCircle
        } else if (d.data.type === NodeType.MembersCircle) {
          // Members Circle
          return settings.padding.membersCircle
        }
        return 0
      })(hierarchyNode)

      // Sort by depth and Y, then raise
      .sort((a, b) =>
        // a.depth === b.depth ? a.y - b.y :
        a.depth < b.depth ? -1 : 1
      )
  )
}
