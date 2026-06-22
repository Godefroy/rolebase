import { describe, expect, it } from 'vitest'
import { CircleFragment, Governance_Mode_Enum, MemberFragment, RoleSummaryFragment } from '../gql'
import { circles, orgData } from '../mocks/circles'
import { OrgData } from './OrgData'

const role = (id: string, over: Partial<RoleSummaryFragment> = {}) =>
  ({
    id,
    name: id,
    base: false,
    singleMember: false,
    parentLink: false,
    colorHue: null,
    ...over,
  }) as RoleSummaryFragment

const circle = (id: string, over: Partial<CircleFragment> = {}) =>
  ({
    id,
    orgId: 'org-1',
    roleId: 'role',
    parentId: null,
    archivedAt: null,
    ...over,
  }) as CircleFragment

const member = (id: string, name: string, over: Partial<MemberFragment> = {}) =>
  ({
    id,
    orgId: 'org-1',
    name,
    description: '',
    archivedAt: null,
    ...over,
  }) as MemberFragment

describe('OrgData lookups', () => {
  describe('by-id getters', () => {
    it('resolves existing entities', () => {
      expect(orgData.getCircle('circle-agence')?.id).toBe('circle-agence')
      expect(orgData.getRole('role-agence')?.id).toBe('role-agence')
      expect(orgData.getMember('member-alice')?.id).toBe('member-alice')
    })

    it('returns undefined for unknown ids', () => {
      expect(orgData.getCircle('nope')).toBeUndefined()
      expect(orgData.getRole('nope')).toBeUndefined()
      expect(orgData.getMember('nope')).toBeUndefined()
    })

    it('returns undefined when no id is given', () => {
      expect(orgData.getCircle(undefined)).toBeUndefined()
      expect(orgData.getRole(undefined)).toBeUndefined()
      expect(orgData.getMember(undefined)).toBeUndefined()
    })
  })

  describe('getActiveMembers', () => {
    it('keeps only members linked to a user account', () => {
      const data = new OrgData({ circles: [], circleMembers: [], circleLinks: [], roles: [], members: [
          member('member-joined', 'Joined', { userId: 'user-1' }),
          member('member-pending', 'Pending'),
        ], governanceMode: Governance_Mode_Enum.Free })
      expect(data.getActiveMembers().map((m) => m.id)).toEqual(['member-joined'])
    })

    it('returns the same cached reference on repeated calls', () => {
      expect(orgData.getActiveMembers()).toBe(orgData.getActiveMembers())
    })
  })

  describe('constructor', () => {
    it('excludes archived circles from the active list and lookups', () => {
      const data = new OrgData({ circles: [circle('circle-a'), circle('circle-archived', { archivedAt: '2024-01-01T00:00:00.000Z' })], circleMembers: [], circleLinks: [], roles: [], members: [], governanceMode: Governance_Mode_Enum.Free })
      expect(data.circles.map((c) => c.id)).toEqual(['circle-a'])
      expect(data.getCircle('circle-archived')).toBeUndefined()
    })

    it('sorts members by name', () => {
      const data = new OrgData({ circles: [], circleMembers: [], circleLinks: [], roles: [], members: [
          member('m-charlie', 'Charlie'),
          member('m-alice', 'Alice'),
          member('m-bob', 'Bob'),
        ], governanceMode: Governance_Mode_Enum.Free })
      expect(data.members.map((m) => m.name)).toEqual([
        'Alice',
        'Bob',
        'Charlie',
      ])
    })

    it('indexes every active circle by id', () => {
      for (const c of circles) {
        expect(orgData.getCircle(c.id)?.id).toBe(c.id)
      }
    })

    it('ignores membership rows pointing to unknown circles or members', () => {
      const data = new OrgData({ circles: [circle('circle-a', { roleId: 'role' })], circleMembers: [
          {
            id: 'cm-ok',
            orgId: 'org-1',
            circleId: 'circle-a',
            memberId: 'member-a',
            createdAt: '',
            archivedAt: null,
          },
          {
            id: 'cm-unknown-circle',
            orgId: 'org-1',
            circleId: 'circle-missing',
            memberId: 'member-a',
            createdAt: '',
            archivedAt: null,
          },
          {
            id: 'cm-unknown-member',
            orgId: 'org-1',
            circleId: 'circle-a',
            memberId: 'member-missing',
            createdAt: '',
            archivedAt: null,
          },
        ], circleLinks: [], roles: [role('role')], members: [member('member-a', 'A')], governanceMode: Governance_Mode_Enum.Free })
      expect(data.membersOf('circle-a').map((m) => m.member.id)).toEqual([
        'member-a',
      ])
    })
  })
})
