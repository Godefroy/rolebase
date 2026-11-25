import { SubscriptionLimits } from '@rolebase/shared/model/subscription'
import { TRPCError } from '@trpc/server'
import { FastifyInstance, FastifyRequest } from 'fastify'
import Stripe from 'stripe'
import { Subscription_Payment_Status_Enum, gql } from '../../gql'
import settings from '../../settings'
import { adminRequest } from '../../utils/adminRequest'
import { getMembersOverSeatLimit } from './utils/getMembersOverSeatLimit'
import { stripe } from './utils/stripe'

export default async (app: FastifyInstance) => {
  // Scope raw body parser to this route with register
  app.register(async (app) => {
    // Get raw body
    app.addContentTypeParser(
      'application/json',
      { parseAs: 'buffer' },
      function (req, body, done) {
        done(null, body)
      }
    )

    app.post('/orgSubscription/stripeWebhook', async (req, res) => {
      // Immediately sending status as per Stripe doc
      res.send('OK')

      const event = validateEvent(req)

      // Handle webhook event (https://stripe.com/docs/billing/subscriptions/webhooks)
      switch (event.type) {
        case 'invoice.paid':
          // Payment has been successfull
          // Send an email ?
          break
        case 'invoice.upcoming':
          // Customer will be charged in a few days, should we send an email ?
          break
        case 'invoice.payment_failed':
          // Payment failed
          // Send an email ?
          break
        case 'customer.subscription.created':
        case 'customer.subscription.updated':
          await updateSubscription(event.data.object as Stripe.Subscription)
          break
        case 'customer.subscription.deleted':
          await deleteSubscription(
            (event.data.object as Stripe.Subscription).id
          )
          break
        case 'payment_method.attached':
          await updateDefaultPaymentMethod(
            event.data.object as Stripe.PaymentMethod
          )
          break
        default:
          console.log(`[STRIPE WEBHOOK]: Unhandled event type ${event.type}`)
          break
      }
    })
  })
}

const validateEvent = (req: FastifyRequest): Stripe.Event => {
  const payload = req.body as Buffer
  const sig = req.headers['stripe-signature']
  try {
    return stripe.webhooks.constructEvent(
      payload,
      sig || '',
      settings.stripe.endpointSecret
    )
  } catch (err) {
    console.error(`[STRIPE WEBHOOK ERROR]: ${(err as Error).message}`)
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: (err as Error).message,
    })
  }
}

const updateDefaultPaymentMethod = async (
  paymentMethod: Stripe.PaymentMethod
) => {
  if (!paymentMethod.customer) {
    throw new TRPCError({ code: 'NOT_FOUND', message: 'Customer not found' })
  }

  const customer = paymentMethod.customer
  const customerId = typeof customer === 'string' ? customer : customer.id

  return stripe.customers.update(customerId, {
    invoice_settings: { default_payment_method: paymentMethod.id },
  })
}

const deleteSubscription = async (subscriptionId: string) => {
  // Limiting the number of active members
  const orgRequestResult = await adminRequest(GET_ORG_MEMBERS, {
    subscriptionId,
  })
  const org = orgRequestResult?.org[0]

  if (org) {
    // Keep the free plan seats, oldest Owners first, and unlink the others
    const memberIdsToUpdate = getMembersOverSeatLimit(
      org.members,
      SubscriptionLimits.free
    )

    if (memberIdsToUpdate.length > 0) {
      await adminRequest(UNLINK_MEMBERS_OVER_LIMIT, {
        ids: memberIdsToUpdate,
      })
    }
  }
  // Not deleting it from the database as it would prevent us from retrieving past invoices
  return adminRequest(UPDATE_ORG_SUBSCRIPTION_STATUS, {
    stripeSubscriptionId: subscriptionId,
    status: Subscription_Payment_Status_Enum.Canceled,
  })
}

const updateSubscription = async (subscription: Stripe.Subscription) => {
  return adminRequest(UPDATE_ORG_SUBSCRIPTION_STATUS, {
    stripeSubscriptionId: subscription.id,
    status: subscription.status as Subscription_Payment_Status_Enum,
  })
}

const UPDATE_ORG_SUBSCRIPTION_STATUS = gql(`
  mutation updateOrgSubscriptionStatusByStripeSubId($stripeSubscriptionId: String!, $status: subscription_payment_status_enum!) {
    update_org_subscription(where: {stripeSubscriptionId: {_eq: $stripeSubscriptionId}}, _set: {status: $status}) {
      returning {
        id
      }
    }
  }`)

const UNLINK_MEMBERS_OVER_LIMIT = gql(`
  mutation unlinkMembersOverSeatLimit($ids: [uuid!]) {
    update_member_many(updates: {where: {id: {_in: $ids}}, _set: {userId: null, inviteDate: null}}) {
      returning {
        id
      }
    }
  }
`)

const GET_ORG_MEMBERS = gql(`
  query getOrgMembersWithRolesFromSubscriptionId($subscriptionId: String!) {
    org(where: {org_subscription: {stripeSubscriptionId: {_eq: $subscriptionId}}}) {
      id
      members(where: {archivedAt: {_is_null: true}, userId: {_is_null: false}}) {
        id
        role
        createdAt
      }
    }
  }
`)
