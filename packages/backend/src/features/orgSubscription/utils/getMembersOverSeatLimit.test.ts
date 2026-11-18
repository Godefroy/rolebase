import { describe, expect, it } from 'vitest'
import { Member_Role_Enum } from '../../../gql'
import { getMembersOverSeatLimit } from './getMembersOverSeatLimit'

const member = (id: string, role: Member_Role_Enum, createdAt: string) => ({
  id,
  role,
  createdAt,
})

describe('getMembersOverSeatLimit', () => {
  it('keeps nothing over the limit when the org fits', () => {
    const members = [member('a', Member_Role_Enum.Owner, '2024-01-01')]
    expect(getMembersOverSeatLimit(members, 5)).toEqual([])
  })

  it('keeps the oldest owners first, then admins, members and readonly', () => {
    const members = [
      member('m1', Member_Role_Enum.Member, '2020-01-01'),
      member('o2', Member_Role_Enum.Owner, '2023-01-01'),
      member('r1', Member_Role_Enum.Readonly, '2019-01-01'),
      member('a1', Member_Role_Enum.Admin, '2021-01-01'),
      member('o1', Member_Role_Enum.Owner, '2022-01-01'),
      member('m2', Member_Role_Enum.Member, '2021-06-01'),
      member('a2', Member_Role_Enum.Admin, '2024-01-01'),
    ]
    expect(getMembersOverSeatLimit(members, 5)).toEqual(['m2', 'r1'])
  })

  it('drops the newest owners when owners alone exceed the limit', () => {
    const members = Array.from({ length: 7 }, (_, i) =>
      member(`o${i}`, Member_Role_Enum.Owner, `202${i}-01-01`)
    )
    expect(getMembersOverSeatLimit(members, 5)).toEqual(['o5', 'o6'])
  })
})
