import { describe, expect, it } from 'vitest'
import { Governance_Mode_Enum } from '../gql'
import { circleMembers, circles, orgData } from '../mocks/circles'
import { members } from '../mocks/members'
import { roles } from '../mocks/roles'
import { LogDisplay, LogType } from './log'
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

const data = (mode: Governance_Mode_Enum) =>
  new OrgData({ circles, circleMembers, circleLinks: [], roles, members, governanceMode: mode })

const perms = (
  circleId: string,
  memberId: string | undefined,
  mode: Governance_Mode_Enum,
  isOrgMember = true,
  isOrgOwner = false
) => {
  const org = data(mode)
  const circle = org.getCircle(circleId)!
  const role = org.getRole(circle.roleId)!
  return org.getCirclePermissions(circle, role, memberId, isOrgMember, isOrgOwner)
}

const canCancel = (
  display: LogDisplay,
  memberId: string | undefined,
  mode: Governance_Mode_Enum,
  isOrgMember = true,
  isOrgOwner = false
) => data(mode).canCancelLog(display, memberId, isOrgMember, isOrgOwner)

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

describe('OrgData.canCancelLog', () => {
  const { Agile } = Governance_Mode_Enum

  it('needs the member-assignment right to undo a member change', () => {
    const display: LogDisplay = {
      type: LogType.CircleMemberAdd,
      id: 'circle-agence-dev',
      name: 'Développeurs',
      memberId: 'member-pam',
      memberName: 'Pam',
    }
    // alice represents circle-agence-dev, pam is only a direct member
    expect(canCancel(display, 'member-alice', Agile)).toBe(true)
    expect(canCancel(display, 'member-pam', Agile)).toBe(false)
  })

  it('needs the structural right to undo a circle change', () => {
    const display: LogDisplay = {
      type: LogType.CircleMove,
      id: 'circle-agence-dev',
      name: 'Développeurs',
      parentId: 'circle-agence',
      parentName: 'Agence',
    }
    expect(canCancel(display, 'member-alice', Agile)).toBe(true)
    expect(canCancel(display, 'member-pam', Agile)).toBe(false)
  })

  it('undoing a base role edit is reserved to org owners', () => {
    const display: LogDisplay = {
      type: LogType.RoleUpdate,
      id: 'role-leader',
      name: 'Leader',
    }
    expect(canCancel(display, 'member-alice', Agile)).toBe(false)
    expect(canCancel(display, 'member-alice', Agile, true, true)).toBe(true)
  })

  it('undoing a role edit follows the circle using it', () => {
    const display: LogDisplay = {
      type: LogType.RoleUpdate,
      id: 'role-dev',
      name: 'Développeurs',
    }
    expect(canCancel(display, 'member-alice', Agile)).toBe(true)
    expect(canCancel(display, 'member-pam', Agile)).toBe(false)
  })

  it('leaves an unresolved target (archived circle) to the backend', () => {
    const display: LogDisplay = {
      type: LogType.CircleArchive,
      id: 'circle-unknown',
      name: 'Archivé',
    }
    expect(canCancel(display, 'member-pam', Agile)).toBe(true)
    expect(canCancel(display, 'member-pam', Agile, false)).toBe(false)
  })
})

describe('OrgData.canEditSomeCircle', () => {
  const { Free, Agile, Strict } = Governance_Mode_Enum

  it('Agile: true for a lead, false for a plain member', () => {
    expect(data(Agile).canEditSomeCircle('member-alice', true, false)).toBe(true)
    expect(data(Agile).canEditSomeCircle('member-pam', true, false)).toBe(false)
  })

  it('Free and org owners can always edit something', () => {
    expect(data(Free).canEditSomeCircle('member-pam', true, false)).toBe(true)
    expect(data(Strict).canEditSomeCircle('member-pam', true, true)).toBe(true)
  })

  it('Strict: a lead keeps member assignment', () => {
    expect(data(Strict).canEditSomeCircle('member-alice', true, false)).toBe(true)
    expect(data(Strict).canEditSomeCircle('member-pam', true, false)).toBe(false)
  })

  it('denies non org-members', () => {
    expect(data(Free).canEditSomeCircle('member-alice', false, false)).toBe(false)
  })
})
