import { SearchDoc, SearchTypes } from '@rolebase/shared/model/search'
import { MemberFragment, MemberSearchFragment, gql } from '../../../gql'
import { adminRequest } from '../../../utils/adminRequest'
import { IndexEntity } from './IndexEntity'

// Declares the fragment for codegen
gql(`
  fragment MemberSearch on member {
    id
    orgId
    name
    description
    picture
  }
`)

const transform = (fragment: MemberSearchFragment): SearchDoc => ({
  objectID: fragment.id,
  orgId: fragment.orgId,
  type: SearchTypes.Member,
  title: fragment.name,
  description: fragment.description,
  boost: 1,
})

export class IndexMember extends IndexEntity<MemberFragment> {
  static table = 'public.member'

  async getById(id: string) {
    const { member_by_pk: member } = await adminRequest(
      gql(`
        query GetMemberForSearch($id: uuid!) {
          member_by_pk(id: $id) {
            ...MemberSearch
          }
        }
      `),
      { id }
    )
    if (!member) return undefined
    return member && transform(member)
  }

  async getAll() {
    const { member } = await adminRequest(
      gql(`
        query GetMembersForSearch {
          member(where: { archivedAt: { _is_null: true } }) {
            ...MemberSearch
          }
        }
      `)
    )
    return member.map(transform)
  }
}
