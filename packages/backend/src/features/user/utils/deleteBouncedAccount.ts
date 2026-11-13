import { gql } from '../../../gql'
import { adminRequest } from '../../../utils/adminRequest'
import {
  deleteUserForGood,
  getUserDeletionTarget,
} from '../../deletion/utils/userDeletion'

// An account is created as soon as a sign-in code is requested: when that
// code bounces, the address was mistyped and the account can never be used.
// Deleted only while it is surely such a leftover: unverified, created within
// the hour, never signed in, member of no org.
export async function deleteBouncedAccount(email: string) {
  const { users } = await adminRequest(GET_BOUNCED_ACCOUNT, {
    email: email.trim().toLowerCase(),
    createdAfter: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
  })
  for (const { id } of users) {
    const target = await getUserDeletionTarget(id)
    if (!target || target.members.length > 0) continue
    await deleteUserForGood(target)
  }
}

const GET_BOUNCED_ACCOUNT = gql(`
  query getBouncedAccount($email: citext!, $createdAfter: timestamptz!) {
    users(
      where: {
        email: { _eq: $email }
        emailVerified: { _eq: false }
        lastSeen: { _is_null: true }
        createdAt: { _gt: $createdAfter }
      }
    ) {
      id
    }
  }
`)
