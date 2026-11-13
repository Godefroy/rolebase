import { gql } from '../../../gql'
import { adminRequest } from '../../../utils/adminRequest'
import {
  deleteUserForGood,
  getUserDeletionTarget,
} from '../../deletion/utils/userDeletion'

const LEFTOVER_MAX_AGE_MS = 60 * 60 * 1000

// The email provider can't deliver to this address anymore.
// An account is created as soon as a sign-in code is requested: when that
// code bounces, the address was mistyped and the account can never be used.
// It is deleted while it is surely such a leftover: unverified, created within
// the hour, never signed in, member of no org. Any other account is kept, with
// its email marked as unverified so the app asks to fix it.
export async function handleBouncedEmail(email: string) {
  const { users } = await adminRequest(GET_BOUNCED_USERS, {
    email: email.trim().toLowerCase(),
  })
  for (const user of users) {
    const isLeftover =
      !user.emailVerified &&
      !user.lastSeen &&
      new Date(user.createdAt).getTime() > Date.now() - LEFTOVER_MAX_AGE_MS
    if (isLeftover) {
      const target = await getUserDeletionTarget(user.id)
      if (target && target.members.length === 0) {
        await deleteUserForGood(target)
        continue
      }
    }
    if (user.emailVerified) {
      await adminRequest(UNVERIFY_USER_EMAIL, { userId: user.id })
    }
  }
}

const GET_BOUNCED_USERS = gql(`
  query getBouncedUsers($email: citext!) {
    users(where: { email: { _eq: $email } }) {
      id
      emailVerified
      lastSeen
      createdAt
    }
  }
`)

const UNVERIFY_USER_EMAIL = gql(`
  mutation unverifyUserEmail($userId: uuid!) {
    updateUser(pk_columns: { id: $userId }, _set: { emailVerified: false }) {
      id
    }
  }
`)
