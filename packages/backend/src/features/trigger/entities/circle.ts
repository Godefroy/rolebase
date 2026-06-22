import { SearchDoc, SearchTypes } from '@rolebase/shared/model/search'
import { CircleFragment, DocumentType, gql } from '../../../gql'
import { adminRequest } from '../../../utils/adminRequest'
import { IndexEntity } from './IndexEntity'

const Fragment = gql(`
  fragment CircleSearch on circle {
    id
    orgId
    role {
      name
    }
  }
`)

export const transform = (
  fragment: DocumentType<typeof Fragment>
): SearchDoc => ({
  objectID: fragment.id,
  orgId: fragment.orgId,
  type: SearchTypes.Circle,
  title: fragment.role.name,
  description: '',
  boost: 2,
})

export class IndexCircle extends IndexEntity<CircleFragment> {
  static table = 'public.circle'

  async getById(id: string) {
    const { circle_by_pk: circle } = await adminRequest(
      gql(`
        query GetCircleForSearch($id: uuid!) {
          circle_by_pk(id: $id) {
            ...CircleSearch
          }
        }
      `),
      { id }
    )
    if (!circle) return undefined
    return circle && transform(circle)
  }

  async getAll() {
    const { circle } = await adminRequest(
      gql(`
        query GetCirclesForSearch {
          circle(where: { archivedAt: { _is_null: true } }) {
            ...CircleSearch
          }
        }
      `)
    )
    return circle.map(transform)
  }
}
