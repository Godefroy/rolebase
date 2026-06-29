import { applyEntitiesChanges } from '@rolebase/shared/helpers/log/applyEntitiesChanges'
import { resolveProposal } from '@rolebase/shared/helpers/resolveProposal'
import {
  EntitiesApplyMethods,
  LogDisplay,
  LogType,
} from '@rolebase/shared/model/log'
import { ProposalVoteValue } from '@rolebase/shared/model/proposal'
import { gql, Thread_Activity_Type_Enum } from '../../gql'
import { adminRequest } from '../../utils/adminRequest'
import { loadOrgData } from '../org/loadOrgData'
import { performArchiveCircle } from '../circle/utils/performArchiveCircle'
import { LoadedProposal } from './loadProposal'

const INSERT_DECISION = gql(`
  mutation insertProposalDecision($values: decision_insert_input!) {
    insert_decision_one(object: $values) {
      id
    }
  }
`)

const INSERT_LOG = gql(`
  mutation insertProposalLog($values: log_insert_input!) {
    insert_log_one(object: $values) {
      id
    }
  }
`)

const UPDATE_ACTIVITY = gql(`
  mutation updateProposalActivity($id: uuid!, $data: jsonb!) {
    update_thread_activity_by_pk(
      pk_columns: { id: $id }
      _set: { data: $data }
    ) {
      id
    }
  }
`)

const INSERT_ACTIVITY = gql(`
  mutation insertProposalEventActivity($values: thread_activity_insert_input!) {
    insert_thread_activity_one(object: $values) {
      id
    }
  }
`)

// Org chart entity getters / mutations (mirror of the webapp resolution methods)
const GET_CIRCLE = gql(`
  query getResolutionCircle($id: uuid!) {
    circle_by_pk(id: $id) { id }
  }
`)
const INSERT_CIRCLE = gql(`
  mutation insertResolutionCircle($object: circle_insert_input!) {
    insert_circle_one(object: $object) { id }
  }
`)
const UPDATE_CIRCLE = gql(`
  mutation updateResolutionCircle($id: uuid!, $values: circle_set_input!) {
    update_circle_by_pk(pk_columns: { id: $id }, _set: $values) { id }
  }
`)
const GET_ROLE = gql(`
  query getResolutionRole($id: uuid!) {
    role_by_pk(id: $id) { id }
  }
`)
const INSERT_ROLE = gql(`
  mutation insertResolutionRole($values: role_insert_input!) {
    insert_role_one(object: $values) { id }
  }
`)
const UPDATE_ROLE = gql(`
  mutation updateResolutionRole($id: uuid!, $values: role_set_input!) {
    update_role_by_pk(pk_columns: { id: $id }, _set: $values) { id }
  }
`)
const GET_CIRCLE_MEMBER = gql(`
  query getResolutionCircleMember($id: uuid!) {
    circle_member_by_pk(id: $id) { id }
  }
`)
const INSERT_CIRCLE_MEMBER = gql(`
  mutation insertResolutionCircleMember($object: circle_member_insert_input!) {
    insert_circle_member_one(object: $object) { id }
  }
`)
const UPDATE_CIRCLE_MEMBER = gql(`
  mutation updateResolutionCircleMember($id: uuid!, $values: circle_member_set_input!) {
    update_circle_member_by_pk(pk_columns: { id: $id }, _set: $values) { id }
  }
`)
const GET_CIRCLE_LINK = gql(`
  query getResolutionCircleLink($id: uuid!) {
    circle_link_by_pk(id: $id) { id }
  }
`)
const INSERT_CIRCLE_LINK = gql(`
  mutation insertResolutionCircleLink($object: circle_link_insert_input!) {
    insert_circle_link_one(object: $object) { id }
  }
`)
const UPDATE_CIRCLE_LINK = gql(`
  mutation updateResolutionCircleLink($id: uuid!, $values: circle_link_set_input!) {
    update_circle_link_by_pk(pk_columns: { id: $id }, _set: $values) { id }
  }
`)

// Database apply methods that create entities with their pre-generated ids.
const dbMethods: EntitiesApplyMethods = {
  circles: {
    get: async (id) =>
      ((await adminRequest(GET_CIRCLE, { id })).circle_by_pk ||
        undefined) as any,
    create: async (data) => {
      await adminRequest(INSERT_CIRCLE, {
        object: {
          id: data.id,
          orgId: data.orgId,
          roleId: data.roleId,
          parentId: data.parentId,
          archivedAt: data.archivedAt,
        },
      })
    },
    update: async (id, values) => {
      await adminRequest(UPDATE_CIRCLE, { id, values: values as any })
    },
  },
  roles: {
    get: async (id) =>
      ((await adminRequest(GET_ROLE, { id })).role_by_pk || undefined) as any,
    create: async (data) => {
      await adminRequest(INSERT_ROLE, { values: data as any })
    },
    update: async (id, values) => {
      await adminRequest(UPDATE_ROLE, { id, values: values as any })
    },
  },
  circlesMembers: {
    get: async (id) =>
      ((await adminRequest(GET_CIRCLE_MEMBER, { id })).circle_member_by_pk ||
        undefined) as any,
    create: async (data) => {
      await adminRequest(INSERT_CIRCLE_MEMBER, {
        object: {
          id: data.id,
          orgId: data.orgId,
          circleId: data.circleId,
          memberId: data.memberId,
        },
      })
    },
    update: async (id, values) => {
      await adminRequest(UPDATE_CIRCLE_MEMBER, { id, values: values as any })
    },
  },
  circlesLinks: {
    get: async (id) =>
      ((await adminRequest(GET_CIRCLE_LINK, { id })).circle_link_by_pk ||
        undefined) as any,
    create: async (data) => {
      await adminRequest(INSERT_CIRCLE_LINK, {
        object: {
          id: data.id,
          orgId: data.orgId,
          parentId: data.parentId,
          circleId: data.circleId,
        },
      })
    },
    update: async (id, values) => {
      await adminRequest(UPDATE_CIRCLE_LINK, { id, values: values as any })
    },
  },
}

// Resolve a proposal: compute the outcome, apply the org chart changes and
// create the decision when approved, then record the result on the thread.
// Runs server-side because a voter may lack the rights to apply the changes.
export async function applyResolution(loaded: LoadedProposal): Promise<void> {
  const { data, votes, author } = loaded
  if (data.status !== 'inProgress') return

  const { approved } = resolveProposal(
    data.decisionMode,
    votes,
    loaded.voterUserIds.length
  )

  let decisionId: string | null = null

  if (approved) {
    // Create the decision first so the applied logs can reference it
    const decision = await adminRequest(INSERT_DECISION, {
      values: {
        orgId: loaded.orgId,
        memberId: author?.id,
        circleId: loaded.circleId,
        title: data.title,
        description: data.description,
      },
    })
    decisionId = decision.insert_decision_one?.id ?? null

    // Load the org data once (not per log) when the proposal archives a circle,
    // since the archive cascade needs it and loading is intensive.
    const archivesCircle = data.logs.some(
      (log) => (log.display as LogDisplay).type === LogType.CircleArchive
    )
    const orgData =
      archivesCircle && author ? await loadOrgData(loaded.orgId) : undefined

    // Apply each prepared change and record a real log linked to the decision
    for (const log of data.logs) {
      const display = log.display as LogDisplay

      // Archiving a circle must run the full nested cascade (members, links,
      // meetings, recurring, threads, tasks, decisions), not just replay the
      // logged circle/role updates, so route it through the shared archive path.
      if (display.type === LogType.CircleArchive && author && orgData) {
        await performArchiveCircle({
          orgData,
          orgId: loaded.orgId,
          circleId: display.id,
          author: {
            userId: loaded.authorUserId,
            memberId: author.id,
            memberName: author.name,
          },
          decisionId,
        })
        continue
      }

      await applyEntitiesChanges(log.changes, dbMethods)
      await adminRequest(INSERT_LOG, {
        values: {
          orgId: loaded.orgId,
          userId: loaded.authorUserId,
          memberId: author?.id,
          memberName: author?.name,
          display: log.display as any,
          changes: log.changes as any,
          decisionId,
        },
      })
    }
  }

  const status = approved ? 'approved' : 'refused'

  await adminRequest(UPDATE_ACTIVITY, {
    id: loaded.activityId,
    data: {
      ...data,
      status,
      resolvedAt: new Date().toISOString(),
      appliedDecisionId: decisionId,
    },
  })

  await adminRequest(INSERT_ACTIVITY, {
    values: {
      threadId: loaded.threadId,
      userId: loaded.authorUserId,
      memberId: author?.id,
      type: Thread_Activity_Type_Enum.ProposalEvent,
      data: {
        proposalActivityId: loaded.activityId,
        event: 'resolution',
        status,
        decisionMode: data.decisionMode,
        votes: votes.map((v) => ({
          userId: v.userId,
          vote: v.vote as ProposalVoteValue,
          memberId: v.memberId ?? undefined,
        })),
        showVoters: data.showVoters,
        decisionId,
      },
    },
  })
}
