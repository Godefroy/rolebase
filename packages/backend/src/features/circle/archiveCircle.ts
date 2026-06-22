import { TRPCError } from '@trpc/server'
import * as yup from 'yup'
import { Member_Role_Enum, gql } from '../../gql'
import { authedProcedure } from '../../trpc/authedProcedure'
import { adminRequest } from '../../utils/adminRequest'
import { loadOrgData } from '../org/loadOrgData'
import { performArchiveCircle } from './utils/performArchiveCircle'

const GET_CIRCLE_ORG = gql(`
  query getCircleOrgForArchive($id: uuid!) {
    circle_by_pk(id: $id) {
      id
      orgId
      parentId
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
    if (!ref.parentId) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'The root circle cannot be archived',
      })
    }

    // Permission: same rule as the webapp (OrgData.getCirclePermissions).
    const orgData = await loadOrgData(ref.orgId)
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
    if (!perms.canEditCircle || !member) {
      throw new TRPCError({ code: 'FORBIDDEN' })
    }

    return performArchiveCircle({
      orgData,
      orgId: ref.orgId,
      circleId,
      author: { userId, memberId: member.id, memberName: member.name },
      meetingId,
    })
  })
