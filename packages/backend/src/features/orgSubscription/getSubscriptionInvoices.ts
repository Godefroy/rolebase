import { Invoice, InvoiceStatus } from '@rolebase/shared/model/subscription'
import Stripe from 'stripe'
import * as yup from 'yup'
import { Member_Role_Enum, gql } from '../../gql'
import { guardOrg } from '../../guards/guardOrg'
import { authedProcedure } from '../../trpc/authedProcedure'
import { adminRequest } from '../../utils/adminRequest'
import { dateFromSeconds } from './utils/dateFromSeconds'
import { getStripeCustomerInvoices } from './utils/stripe'

export default authedProcedure
  .input(
    yup.object().shape({
      orgId: yup.string().required(),
    })
  )
  .query(async (opts): Promise<Invoice[]> => {
    const { orgId } = opts.input

    await guardOrg(orgId, Member_Role_Enum.Owner, opts.ctx)

    const orgSubscription = await adminRequest(GET_ORG_SUBSCRIPTION, { orgId })
    const stripeSubscriptionId =
      orgSubscription?.org_subscription[0]?.stripeSubscriptionId
    const stripeCustomerId =
      orgSubscription?.org_subscription[0]?.stripeCustomerId

    if (!stripeSubscriptionId || !stripeCustomerId) {
      return []
    }

    // Get stripe invoices
    const invoices = await getStripeCustomerInvoices(stripeCustomerId)

    return formatStripeInvoices(invoices)
  })

const formatStripeInvoices = (
  stripeInvoicesList: Stripe.ApiList<Stripe.Invoice>
): Invoice[] => {
  const stripeInvoices = stripeInvoicesList.data
  const invoices: Invoice[] = []

  for (const stripeInvoice of stripeInvoices) {
    invoices.push({
      id: stripeInvoice.id,
      createdAt: dateFromSeconds(stripeInvoice.created),
      pdfUrl: stripeInvoice.invoice_pdf,
      hostedUrl: stripeInvoice.hosted_invoice_url,
      totalInCents: stripeInvoice.total,
      status: stripeInvoice.status as InvoiceStatus,
    })
  }

  return invoices
}

const GET_ORG_SUBSCRIPTION = gql(`
    query getOrgSubscriptionStripeIds($orgId: uuid!) {
      org_subscription(where: {orgId: {_eq: $orgId}}) {
        id
        stripeSubscriptionId
        stripeCustomerId
      }
    }`)
