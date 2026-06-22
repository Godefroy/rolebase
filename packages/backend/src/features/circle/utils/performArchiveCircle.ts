import { OrgData } from '@rolebase/shared/model/OrgData'
import { gql } from '../../../gql'
import { adminRequest } from '../../../utils/adminRequest'
import { insertCircleArchiveLog, LogAuthor } from './circleArchiveLog'

// Archive a circle and its whole subtree in one atomic mutation: the circle and
// its descendants, their non-base roles, members, links (as host or invited),
// meetings, recurring meeting configs, threads, tasks and decisions all receive
// the SAME archivedAt value. Only currently active rows (archivedAt IS NULL) are
// stamped, so entities archived earlier keep their own timestamp and won't be
// pulled into this group's restore.
const ARCHIVE_CIRCLE_CASCADE = gql(`
  mutation archiveCircleCascade(
    $circlesIds: [uuid!]!
    $rolesIds: [uuid!]!
    $archivedAt: timestamptz!
  ) {
    update_circle(
      where: { id: { _in: $circlesIds }, archivedAt: { _is_null: true } }
      _set: { archivedAt: $archivedAt }
    ) {
      returning {
        archivedAt
      }
    }
    update_role(
      where: { id: { _in: $rolesIds }, archivedAt: { _is_null: true } }
      _set: { archivedAt: $archivedAt }
    ) {
      affected_rows
    }
    update_circle_member(
      where: { circleId: { _in: $circlesIds }, archivedAt: { _is_null: true } }
      _set: { archivedAt: $archivedAt }
    ) {
      affected_rows
    }
    update_circle_link(
      where: {
        archivedAt: { _is_null: true }
        _or: [
          { circleId: { _in: $circlesIds } }
          { parentId: { _in: $circlesIds } }
        ]
      }
      _set: { archivedAt: $archivedAt }
    ) {
      affected_rows
    }
    update_meeting(
      where: { circleId: { _in: $circlesIds }, archivedAt: { _is_null: true } }
      _set: { archivedAt: $archivedAt, currentStepId: null }
    ) {
      affected_rows
    }
    update_thread(
      where: { circleId: { _in: $circlesIds }, archivedAt: { _is_null: true } }
      _set: { archivedAt: $archivedAt }
    ) {
      affected_rows
    }
    update_task(
      where: { circleId: { _in: $circlesIds }, archivedAt: { _is_null: true } }
      _set: { archivedAt: $archivedAt }
    ) {
      affected_rows
    }
    update_decision(
      where: { circleId: { _in: $circlesIds }, archivedAt: { _is_null: true } }
      _set: { archivedAt: $archivedAt }
    ) {
      affected_rows
    }
    update_meeting_recurring(
      where: { circleId: { _in: $circlesIds }, archivedAt: { _is_null: true } }
      _set: { archivedAt: $archivedAt }
    ) {
      affected_rows
    }
  }
`)

// Run the circle archive cascade over an already-loaded OrgData, then record the
// activity log. Shared by the archiveCircle tRPC route and proposal resolution.
// The caller is responsible for authorization.
export async function performArchiveCircle(opts: {
  orgData: OrgData
  orgId: string
  circleId: string
  author: LogAuthor
  meetingId?: string | null
  decisionId?: string | null
}): Promise<{ archivedAt: string; circlesIds: string[]; rolesIds: string[] }> {
  const { orgData, orgId, circleId, author, meetingId, decisionId } = opts

  const circle = orgData.getCircle(circleId)
  const role = circle && orgData.getRole(circle.roleId)
  if (!circle || !role) {
    throw new Error(`Circle not found for archive: ${circleId}`)
  }

  // Subtree: the circle and its descendants, plus their non-base roles.
  const subtree = [circle, ...orgData.descendantsOf(circleId)]
  const circlesIds = subtree.map((c) => c.id)
  const rolesIds = subtree
    .filter((c) => !orgData.getRole(c.roleId)?.base)
    .map((c) => c.roleId)

  const result = await adminRequest(ARCHIVE_CIRCLE_CASCADE, {
    circlesIds,
    rolesIds,
    archivedAt: new Date().toISOString(),
  })

  // Use the value as stored/returned by the DB (timestamptz is serialized as
  // "...+00:00", not the "...Z" of toISOString), so the logged archivedAt
  // matches what later reads return and "data changed since" stays accurate.
  const archivedAt = result.update_circle?.returning[0]?.archivedAt as
    | string
    | undefined
  if (!archivedAt) {
    throw new Error(`Circle archive affected no circle: ${circleId}`)
  }

  await insertCircleArchiveLog({
    orgId,
    author,
    circleId,
    roleName: role.name,
    archivedAt,
    meetingId,
    decisionId,
  })

  return { archivedAt, circlesIds, rolesIds }
}
