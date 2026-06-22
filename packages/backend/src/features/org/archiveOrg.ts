import * as yup from 'yup'
import { gql, Member_Role_Enum } from '../../gql'
import { guardOrg } from '../../guards/guardOrg'
import { authedProcedure } from '../../trpc/authedProcedure'
import { adminRequest } from '../../utils/adminRequest'
import { deleteStripeSubscription } from '../orgSubscription/utils/stripe'

export default authedProcedure
  .input(
    yup.object().shape({
      orgId: yup.string().required(),
    })
  )
  .mutation(async (opts): Promise<string> => {
    const { orgId } = opts.input

    await guardOrg(orgId, Member_Role_Enum.Owner, opts.ctx)

    const orgSubscription = await adminRequest(GET_ORG_SUBSCRIPTION, { orgId })
    let stripeSubscriptionId =
      orgSubscription?.org_subscription[0]?.stripeSubscriptionId

    if (stripeSubscriptionId) {
      await deleteStripeSubscription(stripeSubscriptionId)
    }

    await adminRequest(ARCHIVE_ORG, {
      orgId,
      archivedAt: new Date().toISOString(),
    })

    return orgId
  })

const GET_ORG_SUBSCRIPTION = gql(`
    query getOrgSubscriptionStripeStatus($orgId: uuid!) {
      org_subscription(where: {orgId: {_eq: $orgId}}) {
        id
        stripeSubscriptionId
        status
      }
    }`)

const ARCHIVE_ORG = gql(`
  mutation archiveOrg($orgId: uuid!, $archivedAt: timestamptz!) {
    update_org_by_pk(pk_columns: {id: $orgId}, _set: {archivedAt: $archivedAt}) {
      id
    }
  }`)
