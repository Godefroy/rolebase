import * as yup from 'yup'
import { gql, Member_Role_Enum } from '../../gql'
import { guardOrg } from '../../guards/guardOrg'
import { authedProcedure } from '../../trpc/authedProcedure'
import { adminRequest } from '../../utils/adminRequest'

export interface OrgAccessRequest {
  id: string
  createdAt: string
  name: string
  email: string
  avatarUrl: string
}

// Pending requests to join the org, for its admins
export default authedProcedure
  .input(
    yup.object().shape({
      orgId: yup.string().uuid().required(),
    })
  )
  .query(async (opts): Promise<OrgAccessRequest[]> => {
    const { orgId } = opts.input
    await guardOrg(orgId, Member_Role_Enum.Admin, opts.ctx)

    const { org_access_request } = await adminRequest(
      GET_PENDING_ACCESS_REQUESTS,
      { orgId }
    )
    return org_access_request.map((request) => ({
      id: request.id,
      createdAt: request.createdAt,
      name: request.user.displayName,
      email: request.user.email ?? '',
      avatarUrl: request.user.avatarUrl,
    }))
  })

const GET_PENDING_ACCESS_REQUESTS = gql(`
  query getPendingAccessRequests($orgId: uuid!) {
    org_access_request(
      where: { orgId: { _eq: $orgId }, status: { _eq: "Pending" } }
      order_by: { createdAt: asc }
    ) {
      id
      createdAt
      user {
        displayName
        email
        avatarUrl
      }
    }
  }
`)
