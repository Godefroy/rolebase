import { isSubscriptionActive } from '@rolebase/shared/model/subscription'
import { TRPCError } from '@trpc/server'
import { gql } from '../../../gql'
import { adminRequest } from '../../../utils/adminRequest'
import { nhost } from '../../../utils/nhost'
import { deleteStripeSubscription } from '../../orgSubscription/utils/stripe'

export interface OrgDeletionCounts {
  members: number
  users: number
  roles: number
  circles: number
  meetings: number
  threads: number
  messages: number
  tasks: number
  decisions: number
  logs: number
}

export interface OrgSubscriptionSummary {
  orgId: string
  type: string | null
  status: string
  active: boolean
}

export interface OrgDeletionPreview {
  org: { id: string; name: string; slug?: string | null }
  counts: OrgDeletionCounts
  files: number
  subscription: OrgSubscriptionSummary | null
}

export async function getOrg(orgId: string) {
  const { org_by_pk } = await adminRequest(GET_ORG, { orgId })
  if (!org_by_pk) {
    throw new TRPCError({ code: 'NOT_FOUND', message: 'Org not found' })
  }
  return org_by_pk
}

export async function getOrgDeletionPreview(
  orgId: string
): Promise<OrgDeletionPreview> {
  const org = await getOrg(orgId)
  const [counts, files, subscriptions] = await Promise.all([
    getOrgDeletionCounts([orgId]),
    getOrgFileIds([orgId]),
    getOrgSubscriptions([orgId]),
  ])
  const subscription = subscriptions[0]

  return {
    org,
    counts,
    files: files.length,
    subscription: subscription
      ? {
          orgId: subscription.orgId,
          type: subscription.type,
          status: subscription.status,
          active: subscription.active,
        }
      : null,
  }
}

export async function getOrgDeletionCounts(
  orgIds: string[]
): Promise<OrgDeletionCounts> {
  const data = await adminRequest(GET_ORGS_COUNTS, { orgIds })
  return {
    members: data.members.aggregate?.count ?? 0,
    users: data.users.aggregate?.count ?? 0,
    roles: data.roles.aggregate?.count ?? 0,
    circles: data.circles.aggregate?.count ?? 0,
    meetings: data.meetings.aggregate?.count ?? 0,
    threads: data.threads.aggregate?.count ?? 0,
    messages: data.messages.aggregate?.count ?? 0,
    tasks: data.tasks.aggregate?.count ?? 0,
    decisions: data.decisions.aggregate?.count ?? 0,
    logs: data.logs.aggregate?.count ?? 0,
  }
}

export async function getOrgSubscriptions(orgIds: string[]) {
  const { org_subscription } = await adminRequest(GET_ORGS_SUBSCRIPTIONS, {
    orgIds,
  })
  return org_subscription.map((subscription) => ({
    orgId: subscription.orgId,
    type: subscription.type ?? null,
    status: subscription.status,
    active: isSubscriptionActive(subscription.status),
    stripeSubscriptionId: subscription.stripeSubscriptionId ?? null,
  }))
}

const fileUrlRegex =
  /\/files\/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/g

// Files of the orgs: icon, member pictures, org_file, and the files linked in
// their content. Files still used by another org are kept (org icons are
// uploaded per org).
export async function getOrgFileIds(orgIds: string[]): Promise<string[]> {
  if (orgIds.length === 0) return []
  const data = await adminRequest(GET_ORGS_FILES, { orgIds })

  const texts = [
    ...data.thread_activity.map((activity) => JSON.stringify(activity.data)),
    ...data.meeting_step.map((step) => step.notes),
    ...data.meeting.map((meeting) => meeting.summary),
    ...data.task.map((task) => task.description),
    ...data.decision.map((decision) => decision.description),
    ...data.role.flatMap((role) => [
      role.purpose,
      role.domain,
      role.accountabilities,
      role.checklist,
      role.indicators,
      role.notes,
    ]),
    ...data.org.map((org) => org.homeNote),
    ...data.member.map((member) => member.description),
  ]
  const candidates = new Set<string>(
    [
      ...data.org.map((org) => org.iconFileId),
      ...data.member.map((member) => member.pictureFileId),
      ...data.org_file.map((file) => file.fileId),
      ...texts.flatMap((text) =>
        Array.from(text?.matchAll(fileUrlRegex) ?? [], (match) => match[1])
      ),
    ].filter((id): id is string => !!id)
  )
  if (candidates.size === 0) return []

  const { files } = await adminRequest(GET_UNSHARED_FILES, {
    orgIds,
    fileIds: [...candidates],
  })
  return files.map((file) => file.id)
}

// Deletes the orgs in one transaction. Explicit order because of the RESTRICT
// foreign keys (thread_activity.ref*, task.circleId, decision.memberId,
// org_file, org_subscription). The rest cascades from org.
export async function deleteOrgs(orgIds: string[]) {
  if (orgIds.length === 0) return
  await adminRequest(DELETE_ORGS, { orgIds })
}

export async function cancelOrgSubscriptions(orgIds: string[]) {
  const subscriptions = await getOrgSubscriptions(orgIds)
  for (const subscription of subscriptions) {
    if (subscription.stripeSubscriptionId && subscription.active) {
      await deleteStripeSubscription(subscription.stripeSubscriptionId)
    }
  }
}

// Storage API deletes both the row and the stored object. Returns the number
// of files that could not be deleted.
export async function deleteFiles(fileIds: string[]): Promise<number> {
  let failed = 0
  for (const fileId of fileIds) {
    try {
      await nhost.storage.deleteFile(fileId)
    } catch (error) {
      failed++
      console.error(`[Deletion] Failed to delete file ${fileId}`, error)
    }
  }
  return failed
}

// Deletes the orgs, their content and their files for good. Returns the
// number of files that could not be deleted.
export async function deleteOrgsForGood(orgIds: string[]): Promise<number> {
  if (orgIds.length === 0) return 0
  // Files are listed before their references disappear
  const fileIds = await getOrgFileIds(orgIds)
  await cancelOrgSubscriptions(orgIds)
  await deleteOrgs(orgIds)
  return deleteFiles(fileIds)
}

const GET_ORG = gql(`
  query getOrgForDeletion($orgId: uuid!) {
    org_by_pk(id: $orgId) {
      id
      name
      slug
    }
  }
`)

const GET_ORGS_COUNTS = gql(`
  query getOrgsDeletionCounts($orgIds: [uuid!]!) {
    members: member_aggregate(where: { orgId: { _in: $orgIds } }) {
      aggregate { count }
    }
    users: member_aggregate(
      where: { orgId: { _in: $orgIds }, userId: { _is_null: false } }
    ) {
      aggregate { count }
    }
    roles: role_aggregate(where: { orgId: { _in: $orgIds } }) {
      aggregate { count }
    }
    circles: circle_aggregate(where: { orgId: { _in: $orgIds } }) {
      aggregate { count }
    }
    meetings: meeting_aggregate(where: { orgId: { _in: $orgIds } }) {
      aggregate { count }
    }
    threads: thread_aggregate(where: { orgId: { _in: $orgIds } }) {
      aggregate { count }
    }
    messages: thread_activity_aggregate(
      where: { thread: { orgId: { _in: $orgIds } } }
    ) {
      aggregate { count }
    }
    tasks: task_aggregate(where: { orgId: { _in: $orgIds } }) {
      aggregate { count }
    }
    decisions: decision_aggregate(where: { orgId: { _in: $orgIds } }) {
      aggregate { count }
    }
    logs: log_aggregate(where: { orgId: { _in: $orgIds } }) {
      aggregate { count }
    }
  }
`)

const GET_ORGS_SUBSCRIPTIONS = gql(`
  query getOrgsSubscriptionsForDeletion($orgIds: [uuid!]!) {
    org_subscription(where: { orgId: { _in: $orgIds } }) {
      orgId
      type
      status
      stripeSubscriptionId
    }
  }
`)

const GET_ORGS_FILES = gql(`
  query getOrgsFilesForDeletion($orgIds: [uuid!]!) {
    org(where: { id: { _in: $orgIds } }) {
      iconFileId
      homeNote
    }
    member(where: { orgId: { _in: $orgIds } }) {
      pictureFileId
      description
    }
    org_file(where: { orgId: { _in: $orgIds } }) {
      fileId
    }
    thread_activity(where: { thread: { orgId: { _in: $orgIds } } }) {
      data
    }
    meeting_step(where: { meeting: { orgId: { _in: $orgIds } } }) {
      notes
    }
    meeting(where: { orgId: { _in: $orgIds } }) {
      summary
    }
    task(where: { orgId: { _in: $orgIds } }) {
      description
    }
    decision(where: { orgId: { _in: $orgIds } }) {
      description
    }
    role(where: { orgId: { _in: $orgIds } }) {
      purpose
      domain
      accountabilities
      checklist
      indicators
      notes
    }
  }
`)

const GET_UNSHARED_FILES = gql(`
  query getUnsharedFilesForDeletion($orgIds: [uuid!]!, $fileIds: [uuid!]!) {
    files(
      where: {
        id: { _in: $fileIds }
        _not: {
          _or: [
            { orgs: { orgId: { _nin: $orgIds } } }
            { members: { orgId: { _nin: $orgIds } } }
          ]
        }
      }
    ) {
      id
    }
  }
`)

const DELETE_ORGS = gql(`
  mutation deleteOrgs($orgIds: [uuid!]!) {
    delete_thread_activity(where: { thread: { orgId: { _in: $orgIds } } }) {
      affected_rows
    }
    delete_task(where: { orgId: { _in: $orgIds } }) {
      affected_rows
    }
    delete_decision(where: { orgId: { _in: $orgIds } }) {
      affected_rows
    }
    delete_org_file(where: { orgId: { _in: $orgIds } }) {
      affected_rows
    }
    delete_org_subscription(where: { orgId: { _in: $orgIds } }) {
      affected_rows
    }
    delete_org(where: { id: { _in: $orgIds } }) {
      affected_rows
    }
  }
`)
