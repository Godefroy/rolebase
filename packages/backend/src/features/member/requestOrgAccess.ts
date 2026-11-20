import sendMemberActivityEmail from '@rolebase/emails/helpers/sendMemberActivityEmail'
import { TRPCError } from '@trpc/server'
import * as yup from 'yup'
import { gql } from '../../gql'
import settings from '../../settings'
import { authedProcedure } from '../../trpc/authedProcedure'
import { adminRequest } from '../../utils/adminRequest'
import { isConstraintViolation } from '../../utils/isConstraintViolation'
import { getUserColleagueOrgs } from './utils/getUserColleagueOrgs'

// Asks the admins of a colleagues' org (same company email domain) to let the
// user in. They are notified by email and decide on the members page.
export default authedProcedure
  .input(
    yup.object().shape({
      orgId: yup.string().uuid().required(),
    })
  )
  .mutation(async (opts): Promise<void> => {
    const userId = opts.ctx.userId!
    const { orgId } = opts.input

    const { user, orgs } = await getUserColleagueOrgs(userId, { orgId })
    const org = orgs[0]
    if (!user || !org) throw new TRPCError({ code: 'FORBIDDEN' })

    // A single pending request per person and org (unique index)
    try {
      await adminRequest(INSERT_ORG_ACCESS_REQUEST, { orgId, userId })
    } catch (error) {
      if (!isConstraintViolation(error)) throw error
      throw new TRPCError({ code: 'CONFLICT', message: 'Already requested' })
    }

    const { member: admins } = await adminRequest(GET_ORG_ADMINS, { orgId })
    for (const admin of admins) {
      if (!admin.user?.email) continue
      await sendMemberActivityEmail({
        recipients: [{ Email: admin.user.email, Name: admin.name }],
        type: 'OrgAccessRequest',
        lang: admin.user.locale,
        replace: {
          member: user.displayName,
          email: user.email,
          org: org.name,
        },
        picture: user.avatarUrl || '',
        ctaUrl: `${settings.url}/orgs/${orgId}/members`,
      })
    }
  })

const INSERT_ORG_ACCESS_REQUEST = gql(`
  mutation insertOrgAccessRequest($orgId: uuid!, $userId: uuid!) {
    insert_org_access_request_one(object: { orgId: $orgId, userId: $userId }) {
      id
    }
  }
`)

const GET_ORG_ADMINS = gql(`
  query getOrgAdminsForAccessRequest($orgId: uuid!) {
    member(
      where: {
        orgId: { _eq: $orgId }
        archivedAt: { _is_null: true }
        role: { _in: [Owner, Admin] }
        userId: { _is_null: false }
      }
    ) {
      name
      user {
        email
        locale
      }
    }
  }
`)
