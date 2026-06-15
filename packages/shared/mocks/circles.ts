import { CircleFragment, CircleMemberFragment } from '../gql'
import { OrgData } from '../model/OrgData'
import { members } from './members'
import { roles } from './roles'

export const circles: CircleFragment[] = [
  {
    id: 'circle-super',
    orgId: 'org-1',
    roleId: 'role-super',
    parentId: null,
    archived: false,
  },
  {
    id: 'circle-agence',
    orgId: 'org-1',
    roleId: 'role-agence',
    parentId: 'circle-super',
    archived: false,
  },
  {
    id: 'circle-studio',
    orgId: 'org-1',
    roleId: 'role-studio',
    parentId: 'circle-super',
    archived: false,
  },
  {
    id: 'circle-agence-am',
    orgId: 'org-1',
    roleId: 'role-am',
    parentId: 'circle-agence',
    archived: false,
  },
  {
    id: 'circle-agence-dev',
    orgId: 'org-1',
    roleId: 'role-dev',
    parentId: 'circle-agence',
    archived: false,
  },
  {
    id: 'circle-agence-leader',
    orgId: 'org-1',
    roleId: 'role-leader',
    parentId: 'circle-agence',
    archived: false,
  },
  {
    id: 'circle-studio-leader',
    orgId: 'org-1',
    roleId: 'role-leader',
    parentId: 'circle-studio',
    archived: false,
  },
  {
    id: 'circle-agence-am-leader',
    orgId: 'org-1',
    roleId: 'role-leader',
    parentId: 'circle-agence-am',
    archived: false,
  },
  {
    id: 'circle-agence-dev-leader',
    orgId: 'org-1',
    roleId: 'role-leader',
    parentId: 'circle-agence-dev',
    archived: false,
  },
  {
    id: 'circle-agence-dev-facilitator',
    orgId: 'org-1',
    roleId: 'role-facilitator',
    parentId: 'circle-agence-dev',
    archived: false,
  },
]

const circlesMembers: Record<string, string[]> = {
  'circle-agence-dev': ['member-jean-kevin', 'member-pam'],
  'circle-agence-leader': ['member-alice'],
  'circle-studio-leader': ['member-jean-kevin'],
  'circle-agence-am-leader': ['member-bob'],
  'circle-agence-dev-leader': ['member-alice'],
  'circle-agence-dev-facilitator': ['member-bob'],
}

export const circleMembers: CircleMemberFragment[] = circles.flatMap((circle) =>
  (circlesMembers[circle.id] || []).map((memberId) => ({
    id: `${circle.id}-${memberId}`,
    orgId: circle.orgId,
    circleId: circle.id,
    memberId,
    createdAt: new Date().toISOString(),
    archived: false,
  }))
)

export const orgData = new OrgData(circles, circleMembers, [], roles, members)
