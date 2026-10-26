import { gql, Member_Bool_Exp } from '../../../gql'
import { adminRequest } from '../../../utils/adminRequest'
import {
  getOrgDeletionCounts,
  getOrgFileIds,
  getOrgSubscriptions,
  OrgDeletionCounts,
} from './orgDeletion'

export interface UserDeletionTarget {
  user: { id: string; email: string | null; displayName: string }
  members: { id: string; orgId: string; orgName: string; name: string }[]
  // Orgs where nobody else ever took part: deleted with all their content
  soloOrgIds: string[]
}

export interface UserDeletionPreview {
  user: UserDeletionTarget['user']
  deletedOrgs: { id: string; name: string }[]
  deletedOrgsCounts: OrgDeletionCounts
  // Active subscriptions of the deleted orgs, cancelled in Stripe
  cancelledSubscriptions: number
  // Members unlinked from the account, left untouched otherwise
  sharedOrgs: { id: string; name: string; memberName: string }[]
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
  userId: string
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
    name: m.name,
  }))
  const memberIds = members.map((m) => m.id)
  const orgIds = [...new Set(members.map((m) => m.orgId))]

  // An org is shared as soon as someone else has an account or an invitation
  // in it, or left a trace in its history or its threads
  const soloOrgIds = (
    await Promise.all(
      orgIds.map(async (orgId) => {
        const data = await adminRequest(GET_ORG_SHARING, {
          orgId,
          userId,
          memberIds,
        })
        const shared =
          (data.others.aggregate?.count ?? 0) +
          (data.logs.aggregate?.count ?? 0) +
          (data.messages.aggregate?.count ?? 0)
        return shared === 0 ? orgId : null
      })
    )
  ).filter((orgId): orgId is string => !!orgId)

  return {
    user: { id: user.id, email, displayName: user.displayName },
    members,
    soloOrgIds,
  }
}

function getSharedMembers(target: UserDeletionTarget) {
  return target.members.filter((m) => !target.soloOrgIds.includes(m.orgId))
}

export async function getSharedContentCounts(
  target: UserDeletionTarget
): Promise<SharedContentCounts> {
  const data = await adminRequest(GET_SHARED_CONTENT, {
    userId: target.user.id,
    soloOrgIds: target.soloOrgIds,
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
      getOrgDeletionCounts(target.soloOrgIds),
      getOrgSubscriptions(target.soloOrgIds),
    ])
  const orgName = (orgId: string) =>
    target.members.find((m) => m.orgId === orgId)?.orgName ?? orgId

  return {
    user: target.user,
    deletedOrgs: target.soloOrgIds.map((id) => ({ id, name: orgName(id) })),
    deletedOrgsCounts,
    cancelledSubscriptions: subscriptions.filter(
      (s) => s.active && s.stripeSubscriptionId
    ).length,
    sharedOrgs: getSharedMembers(target).map((m) => ({
      id: m.orgId,
      name: m.orgName,
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
  const fileIds = await getOrgFileIds(target.soloOrgIds)
  if (
    getSharedMembers(target).length > 0 ||
    hasSharedContent(await getSharedContentCounts(target))
  ) {
    return fileIds
  }

  const { files } = await adminRequest(GET_UPLOADED_FILES, {
    userId: target.user.id,
    soloOrgIds: target.soloOrgIds,
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
      name
      org {
        name
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
    $soloOrgIds: [uuid!]!
  ) {
    messages: thread_activity_aggregate(
      where: {
        userId: { _eq: $userId }
        thread: { orgId: { _nin: $soloOrgIds } }
      }
    ) {
      aggregate { count }
    }
    reactions: thread_activity_reaction_aggregate(
      where: {
        userId: { _eq: $userId }
        activity: { thread: { orgId: { _nin: $soloOrgIds } } }
      }
    ) {
      aggregate { count }
    }
    votes: thread_proposal_vote_aggregate(
      where: {
        userId: { _eq: $userId }
        activity: { thread: { orgId: { _nin: $soloOrgIds } } }
      }
    ) {
      aggregate { count }
    }
    pollAnswers: thread_poll_answer_aggregate(
      where: {
        userId: { _eq: $userId }
        activity: { thread: { orgId: { _nin: $soloOrgIds } } }
      }
    ) {
      aggregate { count }
    }
    logs: log_aggregate(
      where: { userId: { _eq: $userId }, orgId: { _nin: $soloOrgIds } }
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
    $soloOrgIds: [uuid!]!
  ) {
    files(
      where: {
        uploadedByUserId: { _eq: $userId }
        _not: {
          _or: [
            { orgs: { orgId: { _nin: $soloOrgIds } } }
            { members: { orgId: { _nin: $soloOrgIds } } }
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
