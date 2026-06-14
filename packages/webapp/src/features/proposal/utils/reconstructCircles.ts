import {
  CircleFragment,
  CircleFullFragment,
  CircleLinkFragment,
  CircleMemberFragment,
  MemberFragment,
  RoleFragment,
} from '@gql'
import { fixCirclesHue } from '@rolebase/shared/helpers/fixCirclesHue'
import { fixLostCircles } from '@rolebase/shared/helpers/fixLostCircles'
import { truthy } from '@rolebase/shared/helpers/truthy'

// Rebuild nested CircleFullFragment[] from flat draft arrays.
// Mirrors the store reconstruction in features/org/store/org.ts so the graph
// and role panel see the same shape, but sourced from the in-memory draft.
export function reconstructCircles(
  circles: CircleFragment[],
  roles: RoleFragment[],
  members: MemberFragment[],
  circleMembers: CircleMemberFragment[],
  circleLinks: CircleLinkFragment[]
): CircleFullFragment[] {
  return fixLostCircles(
    fixCirclesHue(
      circles
        .filter((c) => !c.archived)
        .map((circle): CircleFullFragment | undefined => {
          const role = roles.find((r) => r.id === circle.roleId)
          if (!role) return undefined

          const circleFullMembers = circleMembers
            .filter((cm) => cm.circleId === circle.id && !cm.archived)
            .map((cm) => {
              const member = members.find((m) => m.id === cm.memberId)
              if (!member) return undefined
              return { id: cm.id, member }
            })
            .filter(truthy)

          const invitedCircleLinks = circleLinks
            .filter((cl) => cl.parentId === circle.id && !cl.archived)
            .map((cl) => ({ id: cl.id, invitedCircle: { id: cl.circleId } }))

          return {
            ...circle,
            role,
            members: circleFullMembers,
            invitedCircleLinks,
          }
        })
        .filter(truthy)
    )
  )
}
