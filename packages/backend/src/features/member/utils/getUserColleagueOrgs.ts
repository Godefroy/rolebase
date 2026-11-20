import { isSharedEmailDomain } from '@rolebase/shared/helpers/getNameFromEmailDomain'
import { isDisposableEmailDomain } from 'disposable-email-domains-js'
import { gql } from '../../../gql'
import { adminRequest } from '../../../utils/adminRequest'

export interface ColleagueUser {
  email: string
  displayName: string
  avatarUrl: string
  locale: string
}

// Active orgs where accounts with the same company email domain as the user
// are members, and the user is not. Only an owned (verified) address of a
// company domain reveals them. `orgId` restricts the search to one org.
export async function getUserColleagueOrgs(
  userId: string,
  { orgId, limit }: { orgId?: string; limit?: number } = {}
): Promise<{ user?: ColleagueUser; orgs: { id: string; name: string }[] }> {
  const { user } = await adminRequest(GET_USER_FOR_COLLEAGUES, { userId })
  const email = user?.email?.toLowerCase()
  if (!user || !email || !user.emailVerified) return { orgs: [] }
  const colleagueUser = {
    email,
    displayName: user.displayName,
    avatarUrl: user.avatarUrl,
    locale: user.locale,
  }
  const domain = email.split('@')[1]
  if (
    !/^[a-z0-9.-]+$/.test(domain) ||
    isSharedEmailDomain(domain) ||
    isDisposableEmailDomain(domain)
  ) {
    return { user: colleagueUser, orgs: [] }
  }

  const { org } = await adminRequest(GET_COLLEAGUE_ORGS, {
    emailPattern: `%@${domain}`,
    userId,
    orgFilter: orgId ? { id: { _eq: orgId } } : {},
    limit: limit ?? null,
  })
  return { user: colleagueUser, orgs: org }
}

const GET_USER_FOR_COLLEAGUES = gql(`
  query getUserForColleagues($userId: uuid!) {
    user(id: $userId) {
      email
      emailVerified
      displayName
      avatarUrl
      locale
    }
  }
`)

const GET_COLLEAGUE_ORGS = gql(`
  query getColleagueOrgs(
    $emailPattern: citext!
    $userId: uuid!
    $orgFilter: org_bool_exp!
    $limit: Int
  ) {
    org(
      where: {
        _and: [
          $orgFilter
          {
            archivedAt: { _is_null: true }
            members: {
              archivedAt: { _is_null: true }
              user: { email: { _ilike: $emailPattern } }
            }
            _not: { members: { userId: { _eq: $userId } } }
          }
        ]
      }
      order_by: { members_aggregate: { count: desc } }
      limit: $limit
    ) {
      id
      name
    }
  }
`)
