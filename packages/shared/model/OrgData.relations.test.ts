import { describe, expect, it } from 'vitest'
import { CircleFragment, CircleLinkFragment, Governance_Mode_Enum } from '../gql'
import { orgData } from '../mocks/circles'
import { OrgData } from './OrgData'

const circle = (id: string, parentId: string | null = null): CircleFragment => ({
  id,
  orgId: 'org-1',
  roleId: 'role',
  parentId,
  archivedAt: null,
})

const link = (id: string, parentId: string, circleId: string): CircleLinkFragment => ({
  id,
  orgId: 'org-1',
  parentId,
  circleId,
  createdAt: '',
  archivedAt: null,
})

describe('OrgData relations', () => {
  describe('membersOf', () => {
    it('returns the joined members of a circle', () => {
      expect(orgData.membersOf('circle-agence-dev').map((m) => m.member.id)).toEqual([
        'member-jean-kevin',
        'member-pam',
      ])
    })

    it('returns an empty array for a circle without members', () => {
      expect(orgData.membersOf('circle-agence')).toEqual([])
    })
  })

  describe('childrenOf', () => {
    it('returns direct children only', () => {
      expect(orgData.childrenOf('circle-agence').map((c) => c.id)).toEqual([
        'circle-agence-am',
        'circle-agence-dev',
        'circle-agence-leader',
      ])
    })

    it('returns an empty array for a leaf circle', () => {
      expect(orgData.childrenOf('circle-agence-leader')).toEqual([])
    })
  })

  describe('descendantsOf', () => {
    it('returns all descendants recursively', () => {
      const ids = orgData.descendantsOf('circle-agence').map((c) => c.id)
      expect(ids).toHaveLength(6)
      expect(ids).toContain('circle-agence-am')
      expect(ids).toContain('circle-agence-am-leader')
      expect(ids).toContain('circle-agence-dev')
      expect(ids).toContain('circle-agence-dev-leader')
      expect(ids).toContain('circle-agence-dev-facilitator')
      expect(ids).toContain('circle-agence-leader')
    })
  })

  describe('parentsOf', () => {
    it('returns ancestors from the root down to the direct parent', () => {
      const c = orgData.getCircle('circle-agence-dev-leader')!
      expect(orgData.parentsOf(c).map((p) => p.id)).toEqual([
        'circle-super',
        'circle-agence',
        'circle-agence-dev',
      ])
    })

    it('returns an empty array for the root', () => {
      const root = orgData.getCircle('circle-super')!
      expect(orgData.parentsOf(root)).toEqual([])
    })
  })

  describe('andParentsOf', () => {
    it('appends the circle itself to its ancestors', () => {
      expect(orgData.andParentsOf('circle-agence-dev').map((c) => c.id)).toEqual([
        'circle-super',
        'circle-agence',
        'circle-agence-dev',
      ])
    })

    it('returns an empty array for an unknown circle', () => {
      expect(orgData.andParentsOf('unknown')).toEqual([])
    })
  })

  describe('links', () => {
    const data = new OrgData({ circles: [circle('host'), circle('target')], circleMembers: [], circleLinks: [link('link-1', 'host', 'target')], roles: [], members: [], governanceMode: Governance_Mode_Enum.Free })

    it('linksOf returns links hosted by a circle', () => {
      expect(data.linksOf('host').map((l) => l.circleId)).toEqual(['target'])
      expect(data.linksOf('target')).toEqual([])
    })

    it('invitedCirclesOf returns circles invited through links', () => {
      expect(data.invitedCirclesOf('host').map((c) => c.id)).toEqual(['target'])
    })

    it('invitingCirclesOf returns the hosting circles', () => {
      expect(data.invitingCirclesOf('target').map((c) => c.id)).toEqual(['host'])
    })

    it('ignores links pointing to unknown circles', () => {
      expect(data.invitedCirclesOf('host')).toHaveLength(1)
    })
  })
})
