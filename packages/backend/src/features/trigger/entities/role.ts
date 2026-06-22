import { RoleFragment, gql } from '../../../gql'
import { adminRequest } from '../../../utils/adminRequest'
import { HasuraEvent } from '../../../utils/nhost'
import CircleParticipantsCache from '../../participants/CircleParticipantsCache'
import { IndexEntity } from './IndexEntity'
import { transform } from './circle'

// When a role is updated, we need to update the circles that use it
export class IndexRole extends IndexEntity<RoleFragment> {
  static table = 'public.role'

  async applyEvent(event: HasuraEvent<RoleFragment>) {
    if (event.event.op !== 'UPDATE') return

    const { data } = event.event
    const id = data.new?.id ?? data.old?.id
    const orgId = data.new?.orgId ?? data.old?.orgId

    // Have parentLink changed?
    if (id && orgId && data.new?.parentLink !== data.old?.parentLink) {
      // Update circles participants cache
      await CircleParticipantsCache.recomputeOrg(orgId)
    }

    // Have name changed?
    if (id && data.new?.name !== data.old?.name) {
      const { circle } = await adminRequest(
        gql(`
          query GetRoleCirclesForSearch($id: uuid!) {
            circle(where: {
              roleId: { _eq: $id },
              archivedAt: { _is_null: true }
            }) {
              ...CircleSearch
            }
          }
        `),
        { id }
      )

      // Update circles
      const circleDocs = circle.map(transform)
      await this.index.saveObjects(circleDocs).catch(console.error)
    }
  }
}
