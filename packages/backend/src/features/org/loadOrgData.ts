import { OrgData } from '@rolebase/shared/model/OrgData'
import { gql } from '../../gql'
import { adminRequest } from '../../utils/adminRequest'

const GET_ORG_DATA = gql(`
  query getOrgData($orgId: uuid!) {
    org_by_pk(id: $orgId) {
      governanceMode
      circles(where: { archivedAt: { _is_null: true } }) {
        ...Circle
      }
      circleMembers(where: { archivedAt: { _is_null: true } }) {
        ...CircleMember
      }
      circleLinks(where: { archivedAt: { _is_null: true } }) {
        ...CircleLink
      }
      roles(where: { archivedAt: { _is_null: true } }) {
        ...RoleSummary
      }
      members(where: { archivedAt: { _is_null: true } }) {
        ...Member
      }
    }
  }
`)

// Load an org's flat arrays (circles, members, roles + join tables). Exposed
// for callers that need to transform them before indexing (e.g. export of a
// circle subtree).
export async function loadOrgFlatData(orgId: string) {
  const { org_by_pk } = await adminRequest(GET_ORG_DATA, { orgId })
  if (!org_by_pk) {
    throw new Error('Org not found')
  }
  return org_by_pk
}

// Like GET_ORG_DATA but also returns archived circles and roles, so an archived
// subtree can be walked (e.g. to restore a circle). Members and links stay
// active-only so leadership and permission checks remain correct.
const GET_ORG_DATA_WITH_ARCHIVED = gql(`
  query getOrgDataWithArchived($orgId: uuid!) {
    org_by_pk(id: $orgId) {
      governanceMode
      circles {
        ...Circle
      }
      circleMembers(where: { archivedAt: { _is_null: true } }) {
        ...CircleMember
      }
      circleLinks(where: { archivedAt: { _is_null: true } }) {
        ...CircleLink
      }
      roles {
        ...RoleSummary
      }
      members(where: { archivedAt: { _is_null: true } }) {
        ...Member
      }
    }
  }
`)

// Load an org's flat data and index it into the shared OrgData structure.
// Pass includeArchived to also index archived circles/roles (to walk an
// archived subtree, e.g. when restoring a circle).
export async function loadOrgData(
  orgId: string,
  includeArchived = false
): Promise<OrgData> {
  const { org_by_pk } = await adminRequest(
    includeArchived ? GET_ORG_DATA_WITH_ARCHIVED : GET_ORG_DATA,
    { orgId }
  )
  if (!org_by_pk) {
    throw new Error('Org not found')
  }
  return new OrgData({ ...org_by_pk, includeArchived })
}
