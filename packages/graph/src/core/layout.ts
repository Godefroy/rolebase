import { truthy } from '@rolebase/shared/helpers/truthy'
import { MemberSummaryFragment } from '@rolebase/shared/gql'
import { OrgData } from '@rolebase/shared/model/OrgData'
import { Participant } from '@rolebase/shared/model/member'
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
import { CircleData, getViewStrategy, sortById } from './views'

export type { Layout }

// Compute the layout of circles for a given view.
// The view decides which circles are displayed and how they are placed:
// packed inside each other, or laid out as a top-down tree of cards.
// Folded, it only draws the selected circle, its ancestors and their children.
// Pure: usable in browser and server.
export function computeLayout(
  org: OrgData,
  view: CirclesGraphViews,
  folded?: boolean,
  selectedCircleId?: string,
  options: LayoutOptions = {}
): Layout {
  const strategy = getViewStrategy(view, folded)
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
      // circle's own members when shown). A folded card shows its
      // representatives instead, like an invited role card. Left out entirely
      // when they are not displayed, so a circle is not sized around an empty
      // space.
      const memberEntries = options.hideMembers
        ? []
        : circle.memberEntries
        ? circle.memberEntries
        : circle.showMembers
        ? org.membersOf(circle.id)
        : layout === GraphLayoutKind.Tree && circle.participants
        ? leaderEntries(circle.participants)
        : []

      // A role with a representative role stacked under it lists its members
      // in a nameless card of its own, placed first among its sub-roles: kept
      // inside the card, they would come between the role and the
      // representative that hangs from it. Any other role holds its members.
      if (
        layout === GraphLayoutKind.Tree &&
        memberEntries.length !== 0 &&
        children.some(
          (child) => child.type === NodeType.Circle && child.parentLink
        )
      ) {
        children.unshift({
          id: membersCardId(circle.id),
          entityId: circle.id,
          parentId: circle.id,
          name: '',
          type: NodeType.Circle,
          colorHue: data.colorHue,
          membersCard: true,
          children: [membersToData(circle.id, memberEntries, data.colorHue)],
        })
      }
      // Add members in a circle to group them
      else if (memberEntries.length !== 0 || children.length === 0) {
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

// Id of the nameless card listing the members of a role. Free of "_", which
// marks an invited role (link) everywhere else.
function membersCardId(circleId: string): string {
  return `${circleId}-memberscard`
}

// One row of a card: a member of the role, or a representative listed on a
// card the member does not belong to (invited role, folded role)
interface MemberEntry {
  id: string
  member: MemberSummaryFragment
  // Circle the member belongs to, when it is not the card's own circle
  circleId?: string
}

function membersToData(
  circleId: string,
  members: readonly MemberEntry[],
  colorHue?: number,
  // Set when the rows are listed under an invited role card: they belong to
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
    node.children = members.map((entry): Data => {
      const memberCircleId = memberParentId ?? entry.circleId
      return {
        id: memberCircleId ? `${circleId}_${entry.id}` : entry.id,
        entityId: entry.member.id,
        parentId: memberCircleId ?? circleId,
        name: textEllipsis(entry.member.name, 20),
        picture: entry.member.picture,
        type: NodeType.Member,
        colorHue,
      }
    })
  }
  return node
}

// Representatives a card lists instead of members (invited role, folded role):
// the participants the circles view draws as leader avatars, one row per member
function leaderEntries(participants: readonly Participant[]): MemberEntry[] {
  const entries: MemberEntry[] = []
  for (const participant of participants) {
    if (!participant.leader) continue
    if (entries.some((entry) => entry.member.id === participant.member.id)) {
      continue
    }
    entries.push({
      id: `${participant.circleId}-${participant.member.id}`,
      member: participant.member,
      circleId: participant.circleId,
    })
  }
  return entries
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

      // An invited role shows its representatives, never its members: the
      // members belong to the invited role and reading them here would
      // duplicate them. A tree card lists them as rows, like the members of
      // any other card; a packed circle draws them as avatars from its
      // participants, and keeps an empty members circle for padding.
      const members =
        layout === GraphLayoutKind.Tree && participants
          ? membersToData(
              linkId,
              leaderEntries(participants),
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
