import {
  CircleFragment,
  CircleLinkFragment,
  CircleMemberFragment,
  MemberFragment,
  RoleFragment,
  RoleSummaryFragment,
} from '@gql'
import { store } from '@store/index'

export interface FlatData {
  circles: CircleFragment[]
  roles: RoleFragment[]
  members: MemberFragment[]
  circleMembers: CircleMemberFragment[]
  circleLinks: CircleLinkFragment[]
}

// Build flat org entities from the data already in the store. Roles are padded
// from RoleSummary (the store holds no full role text); empty fields are fine
// for graph display and for validating that referenced entities exist.
export function buildFlatFromStore(orgId: string): FlatData {
  const org = store.getState().org
  const storeCircles = org.circles || []
  const storeMembers = org.members || []
  const storeBaseRoles = org.baseRoles || []

  const roleSummaries = new Map<string, RoleSummaryFragment>()
  for (const r of storeBaseRoles) roleSummaries.set(r.id, r)
  for (const c of storeCircles) roleSummaries.set(c.role.id, c.role)
  const roles: RoleFragment[] = [...roleSummaries.values()].map((r) => ({
    orgId,
    archived: false,
    purpose: '',
    domain: '',
    accountabilities: '',
    checklist: '',
    indicators: '',
    notes: '',
    ...r,
  }))

  return {
    circles: storeCircles.map((c) => ({
      id: c.id,
      orgId: c.orgId,
      roleId: c.roleId,
      parentId: c.parentId,
      archived: c.archived,
    })),
    roles,
    members: storeMembers,
    circleMembers: storeCircles.flatMap((c) =>
      c.members.map((m) => ({
        id: m.id,
        circleId: c.id,
        memberId: m.member.id,
        createdAt: '',
        archived: false,
      }))
    ),
    circleLinks: storeCircles.flatMap((c) =>
      c.invitedCircleLinks.map((l) => ({
        id: l.id,
        parentId: c.id,
        circleId: l.invitedCircle.id,
        createdAt: '',
        archived: false,
      }))
    ),
  }
}
