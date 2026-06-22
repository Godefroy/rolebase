import { TRPCError } from '@trpc/server'
import * as yup from 'yup'
import { Member_Role_Enum, gql } from '../../gql'
import { authedProcedure } from '../../trpc/authedProcedure'
import { adminRequest } from '../../utils/adminRequest'
import { loadOrgData } from '../org/loadOrgData'
import { cancelCircleArchiveLog } from './utils/circleArchiveLog'

const GET_CIRCLE_ORG = gql(`
  query getCircleOrgForRestore($id: uuid!) {
    circle_by_pk(id: $id) {
      id
      orgId
      parentId
      archivedAt
    }
  }
`)

// Restore a circle archived with the nested cascade: within the subtree, only
// entities carrying the SAME archivedAt as the circle are reactivated, so
// entities archived in a different operation stay archived.
const RESTORE_CIRCLE_CASCADE = gql(`
  mutation restoreCircleCascade(
    $circlesIds: [uuid!]!
    $rolesIds: [uuid!]!
    $archivedAt: timestamptz!
  ) {
    update_circle(
      where: { id: { _in: $circlesIds }, archivedAt: { _eq: $archivedAt } }
      _set: { archivedAt: null }
    ) {
      affected_rows
    }
    update_role(
      where: { id: { _in: $rolesIds }, archivedAt: { _eq: $archivedAt } }
      _set: { archivedAt: null }
    ) {
      affected_rows
    }
    update_circle_member(
      where: { circleId: { _in: $circlesIds }, archivedAt: { _eq: $archivedAt } }
      _set: { archivedAt: null }
    ) {
      affected_rows
    }
    update_circle_link(
      where: {
        archivedAt: { _eq: $archivedAt }
        _or: [
          { circleId: { _in: $circlesIds } }
          { parentId: { _in: $circlesIds } }
        ]
      }
      _set: { archivedAt: null }
    ) {
      affected_rows
    }
    update_meeting(
      where: { circleId: { _in: $circlesIds }, archivedAt: { _eq: $archivedAt } }
      _set: { archivedAt: null }
    ) {
      affected_rows
    }
    update_thread(
      where: { circleId: { _in: $circlesIds }, archivedAt: { _eq: $archivedAt } }
      _set: { archivedAt: null }
    ) {
      affected_rows
    }
    update_task(
      where: { circleId: { _in: $circlesIds }, archivedAt: { _eq: $archivedAt } }
      _set: { archivedAt: null }
    ) {
      affected_rows
    }
    update_decision(
      where: { circleId: { _in: $circlesIds }, archivedAt: { _eq: $archivedAt } }
      _set: { archivedAt: null }
    ) {
      affected_rows
    }
    update_meeting_recurring(
      where: { circleId: { _in: $circlesIds }, archivedAt: { _eq: $archivedAt } }
      _set: { archivedAt: null }
    ) {
      affected_rows
    }
  }
`)

export default authedProcedure
  .input(
    yup.object().shape({
      circleId: yup.string().required(),
      // Current in-progress meeting of the acting member, to link the log to it.
      meetingId: yup.string().nullable(),
    })
  )
  .mutation(async (opts) => {
    const { circleId, meetingId } = opts.input
    const { userId } = opts.ctx
    if (!userId) throw new TRPCError({ code: 'UNAUTHORIZED' })

    const { circle_by_pk: ref } = await adminRequest(GET_CIRCLE_ORG, {
      id: circleId,
    })
    if (!ref) {
      throw new TRPCError({ code: 'NOT_FOUND', message: 'Circle does not exist' })
    }
    if (!ref.archivedAt) {
      throw new TRPCError({ code: 'BAD_REQUEST', message: 'Circle is not archived' })
    }
    if (!ref.parentId) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'The root circle cannot be restored',
      })
    }

    // OrgData including archived entities: lets us walk the archived subtree and
    // evaluate the same permission rule as the webapp on the archived circle.
    const orgData = await loadOrgData(ref.orgId, true)
    const circle = orgData.getCircle(circleId)
    const role = circle && orgData.getRole(circle.roleId)
    if (!circle || !role) {
      throw new TRPCError({ code: 'NOT_FOUND', message: 'Circle does not exist' })
    }
    const member = orgData.members.find((m) => m.userId === userId)
    const perms = orgData.getCirclePermissions(
      circle,
      role,
      member?.id,
      !!member,
      member?.role === Member_Role_Enum.Owner
    )
    if (!perms.canEditCircle) {
      throw new TRPCError({ code: 'FORBIDDEN' })
    }

    const subtree = [circle, ...orgData.descendantsOf(circleId)]
    const circlesIds = subtree.map((c) => c.id)
    const rolesIds = subtree
      .filter((c) => !orgData.getRole(c.roleId)?.base)
      .map((c) => c.roleId)

    await adminRequest(RESTORE_CIRCLE_CASCADE, {
      circlesIds,
      rolesIds,
      archivedAt: ref.archivedAt,
    })

    // Cancel the circle's archive log and record the cancellation (member is
    // guaranteed: the permission check above requires org membership).
    if (member) {
      await cancelCircleArchiveLog({
        orgId: ref.orgId,
        author: { userId, memberId: member.id, memberName: member.name },
        circleId,
        archivedAt: ref.archivedAt,
        meetingId,
      })
    }

    return { archivedAt: ref.archivedAt, circlesIds, rolesIds }
  })
