import { describe, expect, it } from 'vitest'
import { CircleFragment, RoleSummaryFragment } from '../gql'
import { orgData } from '../mocks/circles'
import { OrgData } from './OrgData'

const role = (id: string, colorHue: number | null): RoleSummaryFragment => ({
  id,
  name: id,
  base: false,
  singleMember: false,
  parentLink: false,
  colorHue,
})

const circle = (
  id: string,
  roleId: string,
  parentId: string | null = null
): CircleFragment => ({
  id,
  orgId: 'org-1',
  roleId,
  parentId,
  archived: false,
})

describe('OrgData getColor', () => {
  it("uses the circle's own role hue", () => {
    // role-leader defines colorHue 0
    expect(orgData.getColor('circle-agence-leader')).toBe(0)
  })

  it('returns null when no role in the chain defines a hue', () => {
    expect(orgData.getColor('circle-agence')).toBeNull()
    expect(orgData.getColor('circle-super')).toBeNull()
  })

  it('inherits the nearest ancestor hue', () => {
    const data = new OrgData(
      [circle('c-parent', 'role-parent'), circle('c-child', 'role-child', 'c-parent')],
      [],
      [],
      [role('role-parent', 200), role('role-child', null)],
      []
    )
    expect(data.getColor('c-child')).toBe(200)
    expect(data.getColor('c-parent')).toBe(200)
  })

  it('returns a stable value across repeated calls (cached)', () => {
    const first = orgData.getColor('circle-agence-dev-leader')
    const second = orgData.getColor('circle-agence-dev-leader')
    expect(first).toBe(second)
    expect(first).toBe(0)
  })

  it('returns null for an unknown circle', () => {
    expect(orgData.getColor('unknown')).toBeNull()
  })
})
