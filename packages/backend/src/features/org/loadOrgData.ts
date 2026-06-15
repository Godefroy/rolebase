import { OrgData } from '@rolebase/shared/model/OrgData'
import { gql } from '../../gql'
import { adminRequest } from '../../utils/adminRequest'

const GET_ORG_DATA = gql(`
  query getOrgData($orgId: uuid!) {
    org_by_pk(id: $orgId) {
      circles(where: { archived: { _eq: false } }) {
        ...Circle
      }
      circleMembers(where: { archived: { _eq: false } }) {
        ...CircleMember
      }
      circleLinks(where: { archived: { _eq: false } }) {
        ...CircleLink
      }
      roles(where: { archived: { _eq: false } }) {
        ...RoleSummary
      }
      members(where: { archived: { _eq: false } }) {
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

// Load an org's flat data and index it into the shared OrgData structure.
export async function loadOrgData(orgId: string): Promise<OrgData> {
  const flat = await loadOrgFlatData(orgId)
  return new OrgData(
    flat.circles,
    flat.circleMembers,
    flat.circleLinks,
    flat.roles,
    flat.members
  )
}
