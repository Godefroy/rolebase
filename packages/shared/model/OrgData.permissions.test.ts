import { describe, expect, it } from 'vitest'
import { Governance_Mode_Enum } from '../gql'
import { circleMembers, circles, orgData } from '../mocks/circles'
import { members } from '../mocks/members'
import { roles } from '../mocks/roles'
import { OrgData } from './OrgData'

const { Free, Agile, Strict } = Governance_Mode_Enum

// Mock org tree (see mocks/circles.ts):
//   circle-super
//   ├── circle-agence            leaders = [alice]  (rep: circle-agence-leader)
//   │   ├── circle-agence-am     leaders = [bob]    (rep: ...-am-leader)
//   │   └── circle-agence-dev    leaders = [alice]  (rep: ...-dev-leader)
//   │       ├── ...-dev-leader   (role-leader: base, singleMember, parentLink)
//   │       └── ...-dev-facilitator (role-facilitator: base, singleMember) members=[bob]
//   └── circle-studio            leaders = [jean-kevin]
// So for circle-agence-dev: alice is leader AND owner; pam is a direct member
// but NOT a leader (the circle is led through its representative).

const perms = (
  circleId: string,
  memberId: string | undefined,
  mode: Governance_Mode_Enum,
  isOrgMember = true,
  isOrgOwner = false
) => {
  const data = new OrgData({ circles, circleMembers, circleLinks: [], roles, members, governanceMode: mode })
  const circle = data.getCircle(circleId)!
  const role = data.getRole(circle.roleId)!
  return data.getCirclePermissions(circle, role, memberId, isOrgMember, isOrgOwner)
}

describe('OrgData permission helpers', () => {
  it('hasRepresentatives reflects parent-link sub-circles', () => {
    expect(orgData.hasRepresentatives('circle-agence-dev')).toBe(true)
    expect(orgData.hasRepresentatives('circle-agence-dev-facilitator')).toBe(
      false
    )
  })

  it('isCircleLeader: representatives lead the circle, direct members do not', () => {
    expect(orgData.isCircleLeader('circle-agence-dev', 'member-alice')).toBe(
      true
    )
    expect(orgData.isCircleLeader('circle-agence-dev', 'member-pam')).toBe(false)
    expect(orgData.isCircleLeader('circle-agence-dev', undefined)).toBe(false)
  })

  it('isCircleOwner: leading the owner circle', () => {
    const dev = orgData.getCircle('circle-agence-dev')!
    expect(orgData.isCircleOwner(dev, 'member-alice')).toBe(true)
    expect(orgData.isCircleOwner(dev, 'member-pam')).toBe(false)
  })
})

describe('OrgData.getCirclePermissions', () => {
  it('denies everything to non org-members', () => {
    expect(perms('circle-agence-dev', 'member-alice', Free, false)).toEqual({
      canEditCircle: false,
      canEditRole: false,
      canEditMembers: false,
      canEditSubCircles: false,
      canEditSubCirclesParentLinks: false,
    })
  })

  it('lets an org owner edit everything, in any mode including strict', () => {
    const p = perms('circle-agence-dev', 'member-pam', Strict, true, true)
    expect(p).toEqual({
      canEditCircle: true,
      canEditRole: true,
      canEditMembers: true,
      canEditSubCircles: true,
      canEditSubCirclesParentLinks: true,
    })
  })

  it('Free: any member edits the whole chart', () => {
    const p = perms('circle-agence-dev', 'member-pam', Free)
    expect(p.canEditCircle).toBe(true)
    expect(p.canEditMembers).toBe(true)
    expect(p.canEditSubCircles).toBe(true)
  })

  it('Agile: the circle lead can edit, a plain member cannot', () => {
    const lead = perms('circle-agence-dev', 'member-alice', Agile)
    expect(lead.canEditCircle).toBe(true)
    expect(lead.canEditSubCircles).toBe(true)
    expect(lead.canEditMembers).toBe(true)

    const plain = perms('circle-agence-dev', 'member-pam', Agile)
    expect(plain.canEditCircle).toBe(false)
    expect(plain.canEditSubCircles).toBe(false)
    expect(plain.canEditMembers).toBe(false)
  })

  it('Strict: structural edits blocked, but the lead still assigns members', () => {
    const p = perms('circle-agence-dev', 'member-alice', Strict)
    expect(p.canEditCircle).toBe(false)
    expect(p.canEditRole).toBe(false)
    expect(p.canEditSubCircles).toBe(false)
    // Representative may still assign members under strict governance
    expect(p.canEditMembers).toBe(true)
  })

  it('Strict: a circle without representatives is managed by its owner', () => {
    // ...-dev-facilitator has no representative; its owner is the dev lead (alice)
    expect(
      perms('circle-agence-dev-facilitator', 'member-alice', Strict)
        .canEditMembers
    ).toBe(true)
    expect(
      perms('circle-agence-dev-facilitator', 'member-pam', Strict).canEditMembers
    ).toBe(false)
  })

  it('base roles can only be edited by the org owner', () => {
    // role-leader is a base role
    const nonOwner = perms('circle-agence-leader', 'member-pam', Free)
    expect(nonOwner.canEditCircle).toBe(true) // free mode
    expect(nonOwner.canEditRole).toBe(false) // but base role needs owner

    expect(
      perms('circle-agence-leader', 'member-pam', Free, true, true).canEditRole
    ).toBe(true)
  })

  it('no sub-circles under a single-member or parent-link role', () => {
    // circle-agence-leader uses role-leader (singleMember + parentLink)
    const p = perms('circle-agence-leader', 'member-pam', Free, true, true)
    expect(p.canEditSubCircles).toBe(false)
    expect(p.canEditSubCirclesParentLinks).toBe(false)
  })
})
