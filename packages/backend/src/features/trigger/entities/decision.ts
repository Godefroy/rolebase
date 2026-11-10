import { SearchDoc, SearchTypes } from '@rolebase/shared/model/search'
import { DecisionFragment, DecisionSearchFragment, gql } from '../../../gql'
import { adminRequest } from '../../../utils/adminRequest'
import { IndexEntity } from './IndexEntity'

// Declares the fragment for codegen
gql(`
  fragment DecisionSearch on decision {
    id
    orgId
    title
    createdAt
  }
`)

const transform = (fragment: DecisionSearchFragment): SearchDoc => ({
  objectID: fragment.id,
  orgId: fragment.orgId,
  type: SearchTypes.Decision,
  title: fragment.title,
  description: '',
  boost: 0,
})

export class IndexDecision extends IndexEntity<DecisionFragment> {
  static table = 'public.decision'

  async getById(id: string) {
    const { decision_by_pk: decision } = await adminRequest(
      gql(`
        query GetDecisionForSearch($id: uuid!) {
          decision_by_pk(id: $id) {
            ...DecisionSearch
          }
        }
      `),
      { id }
    )
    if (!decision) return undefined
    return decision && transform(decision)
  }

  async getAll() {
    const { decision } = await adminRequest(
      gql(`
        query GetDecisionsForSearch {
          decision(where: { archivedAt: { _is_null: true } }) {
            ...DecisionSearch
          }
        }
      `)
    )
    return decision.map(transform)
  }
}
