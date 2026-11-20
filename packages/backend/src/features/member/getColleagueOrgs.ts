import { gql } from '../../gql'
import { authedProcedure } from '../../trpc/authedProcedure'
import { adminRequest } from '../../utils/adminRequest'
import { getUserColleagueOrgs } from './utils/getUserColleagueOrgs'

export type OrgAccessRequestStatus = 'Pending' | 'Accepted' | 'Refused'

export interface ColleagueOrg {
  orgId: string
  orgName: string
  // Status of the user's last access request to this org, if any
  requestStatus: OrgAccessRequestStatus | null
}

// Orgs listed at most, the ones with the most members first
const MAX_ORGS = 3

// Orgs of colleagues (same company email domain) the user is not a member of.
// The onboarding offers to request access to one of them instead of creating
// a new org.
export default authedProcedure.query(
  async (opts): Promise<ColleagueOrg[]> => {
    const userId = opts.ctx.userId!
    const { orgs } = await getUserColleagueOrgs(userId, { limit: MAX_ORGS })
    if (orgs.length === 0) return []

    const { org_access_request } = await adminRequest(
      GET_USER_ACCESS_REQUESTS,
      { userId, orgIds: orgs.map((org) => org.id) }
    )

    return orgs.map((org) => ({
      orgId: org.id,
      orgName: org.name,
      requestStatus:
        (org_access_request.find((request) => request.orgId === org.id)
          ?.status as OrgAccessRequestStatus | undefined) ?? null,
    }))
  }
)

const GET_USER_ACCESS_REQUESTS = gql(`
  query getUserAccessRequests($userId: uuid!, $orgIds: [uuid!]!) {
    org_access_request(
      where: { userId: { _eq: $userId }, orgId: { _in: $orgIds } }
      order_by: { createdAt: desc }
    ) {
      orgId
      status
    }
  }
`)
