import { Circle_Participant_Cache_Insert_Input, gql } from '../../gql'
import { adminRequest } from '../../utils/adminRequest'

export default class CircleParticipantsCache {
  static async recomputeAll() {
    const { circle_participant } = await adminRequest(
      gql(`
        query getAllParticipantsForRecompute {
          circle_participant(where: {
            circle: {
              archivedAt: { _is_null: true }
            }
          }) {
            circleId
            memberId
          }
        }
    `)
    )
    await this.replace(circle_participant)
  }

  static async recomputeOrg(orgId: string) {
    const { circle_participant } = await adminRequest(
      gql(`
        query getOrgParticipantsForRecompute($orgId: uuid!) {
          circle_participant(where: {
            circle: {
              orgId: { _eq: $orgId },
              archivedAt: { _is_null: true }
            }
          }) {
            circleId
            memberId
          }
        }
      `),
      { orgId }
    )
    await this.replace(circle_participant, orgId)
  }

  static async recomputeCircle(circleId: string) {
    const { circle_by_pk } = await adminRequest(
      gql(`
        query getOrgIdForRecompute($circleId: uuid!) {
          circle_by_pk(id: $circleId) {
            orgId
          }
        }
      `),
      { circleId }
    )
    if (!circle_by_pk) return
    await this.recomputeOrg(circle_by_pk.orgId)
  }

  // Clear and insert circle participants in cache table
  // If clearOrgId is provided, only clear and insert participants for this org
  // Otherwise, clear and insert all participants
  private static async replace(
    participants: Circle_Participant_Cache_Insert_Input[],
    clearOrgId?: string
  ) {
    await adminRequest(
      gql(`
        mutation replaceParticipantsForRecompute(
          $participants: [circle_participant_cache_insert_input!]!
          $deleteWhere: circle_participant_cache_bool_exp!
        ) {
          delete_circle_participant_cache(where: $deleteWhere) {
            returning {
              id
            }
          }
          insert_circle_participant_cache(objects: $participants) {
            returning {
              id
            }
          }
        }
    `),
      {
        participants,
        deleteWhere: clearOrgId
          ? { circle: { orgId: { _eq: clearOrgId } } }
          : {},
      }
    )
  }
}
