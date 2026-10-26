import { TRPCError } from '@trpc/server'
import * as yup from 'yup'
import { adminProcedure } from '../../trpc/adminProcedure'
import { gql } from '../../gql'
import { adminRequest } from '../../utils/adminRequest'
import {
  getOrgDeletionCounts,
  getOrgFileIds,
  getOrgSubscriptions,
  OrgDeletionCounts,
  OrgSubscriptionSummary,
} from './utils/orgDeletion'

export interface OrgDeletionPreview {
  org: { id: string; name: string }
  counts: OrgDeletionCounts
  files: number
  subscription: OrgSubscriptionSummary | null
}

export default adminProcedure
  .input(
    yup.object().shape({
      orgId: yup.string().uuid().required(),
    })
  )
  .query(async (opts): Promise<OrgDeletionPreview> => {
    const { orgId } = opts.input
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
  })

export async function getOrg(orgId: string) {
  const { org_by_pk } = await adminRequest(GET_ORG, { orgId })
  if (!org_by_pk) {
    throw new TRPCError({ code: 'NOT_FOUND', message: 'Org not found' })
  }
  return org_by_pk
}

const GET_ORG = gql(`
  query getOrgForDeletion($orgId: uuid!) {
    org_by_pk(id: $orgId) {
      id
      name
    }
  }
`)
