import { isRoleSufficient } from '@rolebase/shared/helpers/isRoleSufficient'
import { TRPCError } from '@trpc/server'
import { gql, Member_Role_Enum } from '../gql'
import { adminRequest } from '../utils/adminRequest'

export async function guardOrg(
  orgId: string,
  minRole: Member_Role_Enum,
  context: { userId?: string; isAdmin?: boolean }
): Promise<void> {
  // Allow Hasura admins (superadmins) to bypass, archived orgs included
  if (context.isAdmin) {
    return
  }

  if (!context.userId) {
    throw new TRPCError({ code: 'UNAUTHORIZED' })
  }

  // Get user role in org
  const result = await adminRequest(GET_USER_ROLE_IN_ORG, {
    orgId,
    userId: context.userId,
  })

  // Check if role is sufficient
  const org = result.org_by_pk
  const role = org?.members[0]?.role
  // An archived (deleted) org is no longer accessible to its members, even
  // before it is purged. Only superadmins can still act on it (restoreOrg).
  if (!org || org.archivedAt || !isRoleSufficient(role, minRole)) {
    throw new TRPCError({ code: 'FORBIDDEN' })
  }
}

const GET_USER_ROLE_IN_ORG = gql(`
  query getUserRoleInOrg($orgId: uuid!, $userId: uuid!) {
    org_by_pk(id: $orgId) {
      archivedAt
      members(where: {userId: {_eq: $userId}}) {
        role
      }
    }
  }`)
