import {
  EntitiesChanges,
  EntityChangeType,
  LogDisplay,
  LogType,
} from '@rolebase/shared/model/log'
import { gql } from '../../../gql'
import { adminRequest } from '../../../utils/adminRequest'

const INSERT_LOG = gql(`
  mutation insertCircleArchiveLog($values: log_insert_input!) {
    insert_log_one(object: $values) {
      id
    }
  }
`)

const CANCEL_LOG = gql(`
  mutation cancelCircleArchiveLog($id: uuid!) {
    update_log_by_pk(pk_columns: { id: $id }, _set: { canceled: true }) {
      id
    }
  }
`)

// The archive log is created right after the circle's archivedAt, so a tight
// window around it locates the log without scanning all org logs. log.display is
// a json column (not filterable in Hasura), hence the in-memory match.
const GET_LOGS_IN_RANGE = gql(`
  query getCircleArchiveLogsInRange(
    $orgId: uuid!
    $from: timestamptz!
    $to: timestamptz!
  ) {
    log(
      where: {
        orgId: { _eq: $orgId }
        createdAt: { _gte: $from, _lte: $to }
        canceled: { _eq: false }
      }
      order_by: { createdAt: asc }
    ) {
      id
      memberId
      memberName
      display
      changes
      cancelLogId
    }
  }
`)

export interface LogAuthor {
  userId: string
  memberId: string
  memberName: string
}

// Reverse an archive log's recorded changes, for the cancellation log entry.
function invertChanges(changes: EntitiesChanges): EntitiesChanges {
  const out: EntitiesChanges = {}
  for (const key of Object.keys(changes) as (keyof EntitiesChanges)[]) {
    const arr = changes[key]
    if (!arr) continue
    out[key] = arr.map((c) =>
      c.type === EntityChangeType.Update
        ? { type: c.type, id: c.id, prevData: c.newData, newData: c.prevData }
        : c
    ) as any
  }
  return out
}

// Record a CircleArchive log for the archived circle only (the cascade is
// nested, so descendants and roles are implied and not logged).
export async function insertCircleArchiveLog(opts: {
  orgId: string
  author: LogAuthor
  circleId: string
  roleName: string
  archivedAt: string
  meetingId?: string | null
  // Set when the archive results from applying a proposal, to link the log to
  // the created decision.
  decisionId?: string | null
}) {
  const display: LogDisplay = {
    type: LogType.CircleArchive,
    id: opts.circleId,
    name: opts.roleName,
  }
  const changes: EntitiesChanges = {
    circles: [
      {
        type: EntityChangeType.Update,
        id: opts.circleId,
        prevData: { archivedAt: null },
        newData: { archivedAt: opts.archivedAt },
      },
    ],
  }
  await adminRequest(INSERT_LOG, {
    values: {
      orgId: opts.orgId,
      userId: opts.author.userId,
      memberId: opts.author.memberId,
      memberName: opts.author.memberName,
      meetingId: opts.meetingId ?? null,
      decisionId: opts.decisionId ?? null,
      display: display as any,
      changes: changes as any,
    },
  })
}

// On restore, cancel the circle's CircleArchive log (if it still exists) and
// record the cancellation in the activity feed.
export async function cancelCircleArchiveLog(opts: {
  orgId: string
  author: LogAuthor
  circleId: string
  archivedAt: string
  meetingId?: string | null
}) {
  const to = new Date(
    new Date(opts.archivedAt).getTime() + 60_000
  ).toISOString()
  const { log } = await adminRequest(GET_LOGS_IN_RANGE, {
    orgId: opts.orgId,
    from: opts.archivedAt,
    to,
  })
  const archiveLog = log.find((l) => {
    const display = l.display as LogDisplay
    return (
      display.type === LogType.CircleArchive &&
      display.id === opts.circleId &&
      !l.cancelLogId
    )
  })
  if (!archiveLog) return

  await adminRequest(CANCEL_LOG, { id: archiveLog.id })
  await adminRequest(INSERT_LOG, {
    values: {
      orgId: opts.orgId,
      userId: opts.author.userId,
      memberId: opts.author.memberId,
      memberName: opts.author.memberName,
      meetingId: opts.meetingId ?? null,
      display: archiveLog.display as any,
      changes: invertChanges(archiveLog.changes as EntitiesChanges) as any,
      cancelLogId: archiveLog.id,
      cancelMemberId: archiveLog.memberId,
      cancelMemberName: archiveLog.memberName,
    },
  })
}
