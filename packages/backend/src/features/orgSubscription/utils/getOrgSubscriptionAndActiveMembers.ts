import { gql } from '../../../gql'
import { adminRequest } from '../../../utils/adminRequest'

export async function getOrgSubscriptionAndActiveMembers(orgId: string) {
  const result = await adminRequest(GET_ORG_SUB_AND_ACTIVE_MEMBERS, {
    orgId,
  })
  const subscription = result.org_by_pk?.org_subscription
  const activeMembers = result.org_by_pk?.active_members.aggregate?.count || 0
  const invitedMembers = result.org_by_pk?.invited_members.aggregate?.count || 0

  return { subscription, activeMembers, invitedMembers }
}

const GET_ORG_SUB_AND_ACTIVE_MEMBERS = gql(`
  query getOrgSubscriptionAndActiveMembers($orgId: uuid!) {
    org_by_pk(id: $orgId) {
      org_subscription {
        ...OrgSubscription
      }
      active_members: members_aggregate(where: {
        archivedAt: { _is_null: true },
        userId: { _is_null: false }
      }) {
        aggregate {
          count
        }
      }
      invited_members: members_aggregate(where: {
        archivedAt: { _is_null: true },
        _and: [
          {
            userId: { _is_null: true },
          },
          {
            inviteEmail: { _is_null: false },
          },
        ],
      }) {
        aggregate {
          count
        }
      }
    }
  }
`)
