import {
  CircleMemberJoined,
  OrgData,
} from '@rolebase/shared/model/OrgData'
import { truthy } from '@rolebase/shared/helpers/truthy'
import * as d3 from 'd3'
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
  org: OrgData,
  view: CirclesGraphViews,
  selectedCircleId?: string
): Layout {
  const strategy = viewStrategies[view]
  const data = prepareData(strategy.getCircles(org, selectedCircleId), org)

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

function prepareData(circles: CircleData[], org: OrgData): Data {
  return {
    id: 'root',
    parentId: null,
    type: NodeType.Circle,
    name: '',
    children: prepareDataInternal(circles, org, null),
  }
}

function prepareDataInternal(
  circles: CircleData[],
  org: OrgData,
  parentId: string | null = null
): Data[] {
  return circles
    .filter((circle) => circle.parentId == parentId)
    .map((circle) => {
      // Define circle data with role name and resolved color
      const data: Data = {
        id: circle.id,
        entityId: circle.id,
        parentId: circle.parentId,
        name: org.roleById.get(circle.roleId)?.name ?? '',
        type: NodeType.Circle,
        colorHue: org.getColor(circle.id) ?? undefined,
      }

      // Add sub-circles to children
      const children: Data[] = prepareDataInternal(circles, org, circle.id)

      // Add circle links
      if (circle.showLinks) {
        const links = org.linksOf(circle.id)
        if (links.length !== 0) {
          children.push(...circleLinksToData(circle, org))
        }
      }

      // Members to render (explicit list for the members view, else the
      // circle's own members when shown)
      const memberEntries = circle.memberEntries
        ? circle.memberEntries
        : circle.showMembers
          ? org.membersOf(circle.id)
          : []

      // Add members in a circle to group them
      if (memberEntries.length !== 0 || children.length === 0) {
        children.push(membersToData(circle.id, memberEntries, data.colorHue))
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

function membersToData(
  circleId: string,
  members: CircleMemberJoined[],
  colorHue?: number
): Data {
  const node: Data = {
    id: `${circleId}-members`,
    parentId: circleId,
    name: '',
    type: NodeType.MembersCircle,
  }
  if (members.length !== 0) {
    node.children = members.map(
      (entry): Data => ({
        id: entry.id,
        entityId: entry.member.id,
        parentId: circleId,
        name: textEllipsis(entry.member.name, 20),
        picture: entry.member.picture,
        type: NodeType.Member,
        colorHue,
      })
    )
  }
  return node
}

function circleLinksToData(circle: CircleData, org: OrgData): Data[] {
  return org.linksOf(circle.id)
    .map((link): Data | undefined => {
      const invitedCircle = org.circleById.get(link.circleId)
      if (!invitedCircle) return

      const colorHue =
        org.getColor(invitedCircle.id) ??
        org.getColor(circle.id) ??
        undefined
      const participants = org.getParticipants(invitedCircle.id)

      return {
        id: `${circle.id}_${link.circleId}`,
        entityId: link.circleId,
        parentId: circle.id,
        name: org.roleById.get(invitedCircle.roleId)?.name ?? '',
        type: NodeType.Circle,
        colorHue,
        participants,
        // Add empty children for padding
        children: [
          {
            id: `${circle.id}_${link.circleId}-members`,
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
