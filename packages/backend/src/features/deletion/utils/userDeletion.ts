import { gql, Member_Bool_Exp, Member_Role_Enum } from '../../../gql'
import { adminRequest } from '../../../utils/adminRequest'
import {
  cancelOrgSubscriptions,
  deleteFiles,
  deleteOrgs,
  getOrgDeletionCounts,
  getOrgFileIds,
  getOrgSubscriptions,
  OrgDeletionCounts,
} from './orgDeletion'

// What happens to an org of the person: "forced" when they are its only
// owner or nobody else took part in it, "optional" when they co-own it (the
// admin chooses), "kept" otherwise (their member is unlinked)
export type UserDeletionOrgChoice = 'forced' | 'optional' | 'kept'

export interface UserDeletionOrg {
  id: string
  name: string
  slug: string | null
  archived: boolean
  choice: UserDeletionOrgChoice
}

export interface UserDeletionTarget {
  user: { id: string; email: string | null; displayName: string }
  members: {
    id: string
    orgId: string
    orgName: string
    orgSlug: string | null
    name: string
    // Active member linked to the account, in an active org
    active: boolean
  }[]
  orgs: UserDeletionOrg[]
  // Orgs deleted with all their content: the forced ones and the optional
  // ones selected
  deletedOrgIds: string[]
}

export interface UserDeletionPreview {
  user: UserDeletionTarget['user']
  orgs: (UserDeletionOrg & { deleted: boolean })[]
  deletedOrgsCounts: OrgDeletionCounts
  // Active subscriptions of the deleted orgs, cancelled in Stripe
  cancelledSubscriptions: number
  // Members unlinked from the account, left untouched otherwise
  sharedOrgs: {
    id: string
    name: string
    slug: string | null
    archived: boolean
    memberName: string
  }[]
  // Rows of the other orgs authored by the account. Their "userId" is NOT
  // NULL and deleted in cascade, so they keep the account row alive.
  sharedContent: SharedContentCounts
  apiKeys: number
  apps: number
  files: number
  accountDeleted: boolean
}

interface SharedContentCounts {
  messages: number
  reactions: number
  votes: number
  logs: number
}

export async function getUserDeletionTarget(
  userId: string,
  optionalOrgIds: string[] = []
): Promise<UserDeletionTarget | null> {
  const { user } = await adminRequest(GET_USER, { userId })
  if (!user) return null
  const email = user.email ?? null

  const where: Member_Bool_Exp = email
    ? {
        _or: [
          { userId: { _eq: userId } },
          // Escape LIKE wildcards: only a case-insensitive equality is wanted
          { inviteEmail: { _ilike: email.replace(/[\\%_]/g, '\\$&') } },
        ],
      }
    : { userId: { _eq: userId } }
  const { member } = await adminRequest(GET_MEMBERS, { where })
  const members = member.map((m) => ({
    id: m.id,
    orgId: m.orgId,
    orgName: m.org.name,
    orgSlug: m.org.slug ?? null,
    name: m.name,
    active: m.userId === userId && !m.archivedAt && !m.org.archivedAt,
  }))
  const memberIds = members.map((m) => m.id)
  const orgIds = [...new Set(members.map((m) => m.orgId))]

  const orgs = await Promise.all(
    orgIds.map(async (orgId): Promise<UserDeletionOrg> => {
      const orgMembers = member.filter((m) => m.orgId === orgId)
      const data = await adminRequest(GET_ORG_SHARING, {
        orgId,
        userId,
        memberIds,
      })
      // An org is shared as soon as someone else has an account or an
      // invitation in it, or left a trace in its history or its threads
      const shared =
        (data.others.aggregate?.count ?? 0) +
        (data.logs.aggregate?.count ?? 0) +
        (data.messages.aggregate?.count ?? 0)
      const isOwner = orgMembers.some(
        (m) =>
          m.userId === userId &&
          !m.archivedAt &&
          m.role === Member_Role_Enum.Owner
      )
      const otherOwners = data.owners.aggregate?.count ?? 0
      return {
        id: orgId,
        name: orgMembers[0].org.name,
        slug: orgMembers[0].org.slug ?? null,
        archived: !!orgMembers[0].org.archivedAt,
        choice:
          shared === 0 || (isOwner && otherOwners === 0)
            ? 'forced'
            : isOwner
              ? 'optional'
              : 'kept',
      }
    })
  )

  return {
    user: { id: user.id, email, displayName: user.displayName },
    members,
    orgs,
    deletedOrgIds: orgs
      .filter(
        (org) =>
          org.choice === 'forced' ||
          (org.choice === 'optional' && optionalOrgIds.includes(org.id))
      )
      .map((org) => org.id),
  }
}

// Active orgs the person is still an active member of
export function getActiveOrgs(target: UserDeletionTarget) {
  const orgIds = new Set(
    target.members.filter((m) => m.active).map((m) => m.orgId)
  )
  return target.orgs.filter((org) => orgIds.has(org.id))
}

function getSharedMembers(target: UserDeletionTarget) {
  return target.members.filter((m) => !target.deletedOrgIds.includes(m.orgId))
}

export async function getSharedContentCounts(
  target: UserDeletionTarget
): Promise<SharedContentCounts> {
  const data = await adminRequest(GET_SHARED_CONTENT, {
    userId: target.user.id,
    deletedOrgIds: target.deletedOrgIds,
  })
  return {
    messages: data.messages.aggregate?.count ?? 0,
    reactions: data.reactions.aggregate?.count ?? 0,
    votes:
      (data.votes.aggregate?.count ?? 0) +
      (data.pollAnswers.aggregate?.count ?? 0),
    logs: data.logs.aggregate?.count ?? 0,
  }
}

function hasSharedContent(counts: SharedContentCounts) {
  return Object.values(counts).some((count) => count > 0)
}

export async function getUserDeletionPreview(
  target: UserDeletionTarget
): Promise<UserDeletionPreview> {
  const [sharedContent, accountData, files, deletedOrgsCounts, subscriptions] =
    await Promise.all([
      getSharedContentCounts(target),
      adminRequest(GET_ACCOUNT_DATA, { userId: target.user.id }),
      getUserFileIds(target),
      getOrgDeletionCounts(target.deletedOrgIds),
      getOrgSubscriptions(target.deletedOrgIds),
    ])
  return {
    user: target.user,
    orgs: target.orgs.map((org) => ({
      ...org,
      deleted: target.deletedOrgIds.includes(org.id),
    })),
    deletedOrgsCounts,
    cancelledSubscriptions: subscriptions.filter(
      (s) => s.active && s.stripeSubscriptionId
    ).length,
    sharedOrgs: getSharedMembers(target).map((m) => ({
      id: m.orgId,
      name: m.orgName,
      slug: m.orgSlug,
      archived: !!target.orgs.find((org) => org.id === m.orgId)?.archived,
      memberName: m.name,
    })),
    sharedContent,
    apiKeys: accountData.apiKeys.aggregate?.count ?? 0,
    apps: accountData.apps.aggregate?.count ?? 0,
    files: files.length,
    accountDeleted: !hasSharedContent(sharedContent),
  }
}

// Files of the deleted orgs. The person's other uploads are deleted only when
// no other org may use them in its content.
export async function getUserFileIds(
  target: UserDeletionTarget
): Promise<string[]> {
  const fileIds = await getOrgFileIds(target.deletedOrgIds)
  if (
    getSharedMembers(target).length > 0 ||
    hasSharedContent(await getSharedContentCounts(target))
  ) {
    return fileIds
  }

  const { files } = await adminRequest(GET_UPLOADED_FILES, {
    userId: target.user.id,
    deletedOrgIds: target.deletedOrgIds,
  })
  return [...new Set([...fileIds, ...files.map((file) => file.id)])]
}

// Unlinks the shared members and erases the account. The account row is
// deleted when nothing of the other orgs references it, anonymized otherwise.
export async function eraseUserAccount(target: UserDeletionTarget) {
  const userId = target.user.id
  await adminRequest(ERASE_ACCOUNT, {
    userId,
    sharedMemberIds: getSharedMembers(target).map((m) => m.id),
  })
  if (!hasSharedContent(await getSharedContentCounts(target))) {
    await adminRequest(DELETE_USER, { userId })
  }
}

// Deletes the orgs to delete, unlinks the person from the other ones and
// erases the account. Returns the number of files that could not be deleted.
export async function deleteUserForGood(
  target: UserDeletionTarget
): Promise<number> {
  // Files are listed before their references disappear
  const fileIds = await getUserFileIds(target)
  await cancelOrgSubscriptions(target.deletedOrgIds)
  await deleteOrgs(target.deletedOrgIds)
  await eraseUserAccount(target)
  return deleteFiles(fileIds)
}

const GET_USER = gql(`
  query getUserForDeletion($userId: uuid!) {
    user(id: $userId) {
      id
      email
      displayName
    }
  }
`)

const GET_MEMBERS = gql(`
  query getMembersForUserDeletion($where: member_bool_exp!) {
    member(where: $where, order_by: { org: { name: asc } }) {
      id
      orgId
      userId
      name
      role
      archivedAt
      org {
        name
        slug
        archivedAt
      }
    }
  }
`)

const GET_ORG_SHARING = gql(`
  query getOrgSharingForUserDeletion(
    $orgId: uuid!
    $userId: uuid!
    $memberIds: [uuid!]!
  ) {
    others: member_aggregate(
      where: {
        orgId: { _eq: $orgId }
        id: { _nin: $memberIds }
        _or: [
          { userId: { _is_null: false } }
          { inviteEmail: { _is_null: false } }
        ]
      }
    ) {
      aggregate { count }
    }
    owners: member_aggregate(
      where: {
        orgId: { _eq: $orgId }
        id: { _nin: $memberIds }
        role: { _eq: Owner }
        archivedAt: { _is_null: true }
      }
    ) {
      aggregate { count }
    }
    logs: log_aggregate(
      where: { orgId: { _eq: $orgId }, userId: { _neq: $userId } }
    ) {
      aggregate { count }
    }
    messages: thread_activity_aggregate(
      where: { thread: { orgId: { _eq: $orgId } }, userId: { _neq: $userId } }
    ) {
      aggregate { count }
    }
  }
`)

const GET_SHARED_CONTENT = gql(`
  query getSharedContentForUserDeletion(
    $userId: uuid!
    $deletedOrgIds: [uuid!]!
  ) {
    messages: thread_activity_aggregate(
      where: {
        userId: { _eq: $userId }
        thread: { orgId: { _nin: $deletedOrgIds } }
      }
    ) {
      aggregate { count }
    }
    reactions: thread_activity_reaction_aggregate(
      where: {
        userId: { _eq: $userId }
        activity: { thread: { orgId: { _nin: $deletedOrgIds } } }
      }
    ) {
      aggregate { count }
    }
    votes: thread_proposal_vote_aggregate(
      where: {
        userId: { _eq: $userId }
        activity: { thread: { orgId: { _nin: $deletedOrgIds } } }
      }
    ) {
      aggregate { count }
    }
    pollAnswers: thread_poll_answer_aggregate(
      where: {
        userId: { _eq: $userId }
        activity: { thread: { orgId: { _nin: $deletedOrgIds } } }
      }
    ) {
      aggregate { count }
    }
    logs: log_aggregate(
      where: { userId: { _eq: $userId }, orgId: { _nin: $deletedOrgIds } }
    ) {
      aggregate { count }
    }
  }
`)

const GET_ACCOUNT_DATA = gql(`
  query getAccountDataForUserDeletion($userId: uuid!) {
    apiKeys: api_key_aggregate(where: { userId: { _eq: $userId } }) {
      aggregate { count }
    }
    apps: user_app_aggregate(where: { userId: { _eq: $userId } }) {
      aggregate { count }
    }
  }
`)

const GET_UPLOADED_FILES = gql(`
  query getUploadedFilesForUserDeletion(
    $userId: uuid!
    $deletedOrgIds: [uuid!]!
  ) {
    files(
      where: {
        uploadedByUserId: { _eq: $userId }
        _not: {
          _or: [
            { orgs: { orgId: { _nin: $deletedOrgIds } } }
            { members: { orgId: { _nin: $deletedOrgIds } } }
          ]
        }
      }
    ) {
      id
    }
  }
`)

const ERASE_ACCOUNT = gql(`
  mutation eraseAccountForUserDeletion(
    $userId: uuid!
    $sharedMemberIds: [uuid!]!
  ) {
    update_member(
      where: { id: { _in: $sharedMemberIds } }
      _set: { userId: null, inviteEmail: null, inviteDate: null }
    ) {
      affected_rows
    }
    delete_user_app(where: { userId: { _eq: $userId } }) {
      affected_rows
    }
    delete_api_key(where: { userId: { _eq: $userId } }) {
      affected_rows
    }
    deleteAuthRefreshTokens(where: { userId: { _eq: $userId } }) {
      affected_rows
    }
    deleteAuthUserProviders(where: { userId: { _eq: $userId } }) {
      affected_rows
    }
    deleteAuthUserSecurityKeys(where: { userId: { _eq: $userId } }) {
      affected_rows
    }
    deleteAuthOauth2AuthRequests(where: { userId: { _eq: $userId } }) {
      affected_rows
    }
    deleteAuthOauth2RefreshTokens(where: { userId: { _eq: $userId } }) {
      affected_rows
    }
    updateFiles(
      where: { uploadedByUserId: { _eq: $userId } }
      _set: { uploadedByUserId: null }
    ) {
      affected_rows
    }
    updateUser(
      pk_columns: { id: $userId }
      _set: {
        email: null
        newEmail: null
        phoneNumber: null
        displayName: "Deleted user"
        avatarUrl: ""
        passwordHash: null
        otpHash: null
        totpSecret: null
        activeMfaType: null
        ticket: null
        currentChallenge: null
        metadata: null
        lastSeen: null
        emailVerified: false
        phoneNumberVerified: false
        disabled: true
      }
    ) {
      id
    }
  }
`)

const DELETE_USER = gql(`
  mutation deleteUserForUserDeletion($userId: uuid!) {
    deleteUser(id: $userId) {
      id
    }
  }
`)
