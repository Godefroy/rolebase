import { truthy } from '@rolebase/shared/helpers/truthy'
import { CircleMemberJoined, OrgData } from '@rolebase/shared/model/OrgData'
import { textEllipsis } from '../helpers/textEllipsis'
import {
  CirclesGraphViews,
  Data,
  GraphLayoutKind,
  Layout,
  LayoutOptions,
  NodeType,
} from '../types'
import { computePackLayout } from './layouts/pack'
import { computeTreeLayout } from './layouts/tree'
import { CircleData, sortById, viewStrategies } from './views'

export type { Layout }

// Compute the layout of circles for a given view.
// The view decides which circles are displayed and how they are placed:
// packed inside each other, or laid out as a top-down tree of cards.
// Pure: usable in browser and server.
export function computeLayout(
  org: OrgData,
  view: CirclesGraphViews,
  selectedCircleId?: string,
  options: LayoutOptions = {}
): Layout {
  const strategy = viewStrategies[view]
  const layout = strategy.layout ?? GraphLayoutKind.Pack
  const data = prepareData(
    strategy.getCircles(org, selectedCircleId),
    org,
    layout,
    options
  )

  return layout === GraphLayoutKind.Tree
    ? computeTreeLayout(data)
    : computePackLayout(data, strategy.packSorting ?? sortById)
}

function prepareData(
  circles: CircleData[],
  org: OrgData,
  layout: GraphLayoutKind,
  options: LayoutOptions
): Data {
  return {
    id: 'root',
    parentId: null,
    type: NodeType.Circle,
    name: '',
    children: prepareDataInternal(circles, org, layout, options, null),
  }
}

function prepareDataInternal(
  circles: CircleData[],
  org: OrgData,
  layout: GraphLayoutKind,
  options: LayoutOptions,
  parentId: string | null = null
): Data[] {
  return circles
    .filter((circle) => circle.parentId == parentId)
    .map((circle) => {
      // Define circle data with role name and resolved color
      const role = org.roleById.get(circle.roleId)
      const data: Data = {
        id: circle.id,
        entityId: circle.id,
        parentId: circle.parentId,
        name: role?.name ?? '',
        type: NodeType.Circle,
        colorHue: org.getColor(circle.id) ?? undefined,
        parentLink: role?.parentLink,
      }

      // Add sub-circles to children
      const children: Data[] = prepareDataInternal(
        circles,
        org,
        layout,
        options,
        circle.id
      )

      // Add circle links
      if (circle.showLinks) {
        const links = org.linksOf(circle.id)
        if (links.length !== 0) {
          children.push(...circleLinksToData(circle, org, layout, options))
        }
      }

      // Members to render (explicit list for the members view, else the
      // circle's own members when shown). Left out entirely when they are not
      // displayed, so a circle is not sized around an empty space.
      const memberEntries = options.hideMembers
        ? []
        : circle.memberEntries
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

      // Leader avatars are members too: they follow the same option
      if (circle.participants && !options.hideMembers) {
        data.participants = circle.participants
      }

      return data
    })
}

function membersToData(
  circleId: string,
  members: readonly CircleMemberJoined[],
  colorHue?: number,
  // Set when the members are listed under an invited role card: they belong to
  // the invited circle, and their node ids are scoped to the card so they stay
  // unique next to the same members under the invited circle's own card
  memberParentId?: string
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
        id: memberParentId ? `${circleId}_${entry.id}` : entry.id,
        entityId: entry.member.id,
        parentId: memberParentId ?? circleId,
        name: textEllipsis(entry.member.name, 20),
        picture: entry.member.picture,
        type: NodeType.Member,
        colorHue,
      })
    )
  }
  return node
}

function circleLinksToData(
  circle: CircleData,
  org: OrgData,
  layout: GraphLayoutKind,
  options: LayoutOptions
): Data[] {
  return org
    .linksOf(circle.id)
    .map((link): Data | undefined => {
      const invitedCircle = org.circleById.get(link.circleId)
      if (!invitedCircle) return

      const colorHue =
        org.getColor(invitedCircle.id) ?? org.getColor(circle.id) ?? undefined
      const participants = options.hideMembers
        ? undefined
        : org.getParticipants(invitedCircle.id)
      const linkId = `${circle.id}_${link.circleId}`

      // A tree card is read as a whole, so an invited role lists its members
      // like any other. A packed circle nests inside its inviting circle,
      // where the members would be a confusing duplicate: it keeps an empty
      // members circle, for padding, and its leaders.
      const members =
        layout === GraphLayoutKind.Tree && !options.hideMembers
          ? membersToData(
              linkId,
              org.membersOf(invitedCircle.id),
              colorHue,
              invitedCircle.id
            )
          : {
              id: `${linkId}-members`,
              parentId: circle.id,
              name: '',
              type: NodeType.MembersCircle,
            }

      return {
        id: linkId,
        entityId: link.circleId,
        parentId: circle.id,
        name: org.roleById.get(invitedCircle.roleId)?.name ?? '',
        type: NodeType.Circle,
        colorHue,
        participants,
        children: [members],
      }
    })
    .filter(truthy)
}
