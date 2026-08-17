import { SubscriptionIntentResponse } from '@rolebase/shared/model/subscription'
import {
  addressSchema,
  subscriptionPlanTypeSchema,
} from '@rolebase/shared/schemas'
import { TRPCError } from '@trpc/server'
import * as yup from 'yup'
import { Member_Role_Enum, gql } from '../../gql'
import { guardOrg } from '../../guards/guardOrg'
import { authedProcedure } from '../../trpc/authedProcedure'
import { adminRequest } from '../../utils/adminRequest'
import { getPlanTypePriceId } from './utils/getPlanTypePriceId'
import { isSubscriptionActive } from '@rolebase/shared/model/subscription'
import { setNullValuesToUndefined } from './utils/setNullValuesToUndefined'
import {
  createStripeCustomer,
  createStripeSubscription,
  deleteStripeSubscription,
  getStripeCustomerOpenInvoice,
} from './utils/stripe'

export default authedProcedure
  .input(
    yup.object().shape({
      orgId: yup.string().required(),
      planType: subscriptionPlanTypeSchema,
      address: addressSchema.required(),
      promotionCode: yup.string().optional().nullable(),
    })
  )
  .mutation(async (opts): Promise<SubscriptionIntentResponse> => {
    const { orgId, planType, promotionCode, address } = opts.input

    const org = (await adminRequest(GET_ORG_DETAILS, { orgId }))?.org_by_pk

    if (!org || !planType) {
      throw new TRPCError({ code: 'NOT_FOUND' })
    }

    await guardOrg(orgId, Member_Role_Enum.Owner, opts.ctx)

    const user = (await adminRequest(GET_USER_EMAIL, { id: opts.ctx.userId! }))
      .user

    if (!user || !user.email) {
      console.error('[SUBSCRIPTION ERROR]: could not retrieve user email')
      throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' })
    }

    const orgSubscription = (
      await adminRequest(GET_ORG_SUBSCRIPTION_STATUS, { orgId })
    )?.org_subscription[0]

    const status = orgSubscription?.status
    let customerId = orgSubscription?.stripeCustomerId
    let subscriptionId = orgSubscription?.stripeSubscriptionId
    let currentPlanType = orgSubscription?.type

    // An unpaid invoice must be settled before any subscription change,
    // otherwise each attempt leaves behind an incomplete subscription
    if (customerId && (await getStripeCustomerOpenInvoice(customerId))) {
      throw new TRPCError({
        code: 'CONFLICT',
        message: 'An invoice is awaiting payment',
      })
    }

    if (isSubscriptionActive(status)) {
      // A subscription is already active, at the moment throwing an error as there is only one plan available
      if (currentPlanType === planType) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Subscription already active',
        })
      }

      if (subscriptionId) {
        await deleteStripeSubscription(subscriptionId)
      }
    }

    const priceId = getPlanTypePriceId(planType)
    const quantity = org.members.filter((mem) => !!mem.userId)?.length // Number of active members inside the org

    if (!quantity || quantity === 0) {
      console.error(
        `[SUBSCRIPTION ERROR]: could not calculate quantity for org ${orgId}`
      )
      throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' })
    }

    if (!customerId) {
      customerId = (
        await createStripeCustomer(
          user.email,
          org.name,
          setNullValuesToUndefined(address)
        )
      ).id
    }

    const stripeSubscription = await createStripeSubscription(
      orgId,
      customerId,
      priceId,
      quantity,
      promotionCode
    )

    if (!orgSubscription) {
      await adminRequest(CREATE_ORG_SUBSCRIPTION, {
        orgId,
        subscriptionId: stripeSubscription.id,
        customerId: customerId,
        type: planType,
      })
    } else {
      await adminRequest(UPDATE_ORG_SUBSCRIPTION, {
        orgId,
        stripeSubscriptionId: stripeSubscription.id,
        type: planType,
      })
    }

    // If free trial is implemented, the clientSecret will not be present
    // To avoid a crash, maybe return a status that the front will handle ?

    const clientSecret =
      stripeSubscription.latest_invoice?.payment_intent?.client_secret ?? ''
    const pricePerSeat = stripeSubscription.items.data[0].price.unit_amount ?? 0

    return {
      subscriptionId: stripeSubscription.id,
      clientSecret,
      isFreeOrTrial: !clientSecret || pricePerSeat === 0,
      price: {
        quantity: stripeSubscription.items.data[0].quantity ?? 0,
        totalPerSeatInCents: pricePerSeat,
      },
    }
  })

const GET_USER_EMAIL = gql(`
  query getUserEmail($id: uuid!) {
    user(id: $id) {
      id
      email
    }
  }`)

const GET_ORG_DETAILS = gql(`
  query getOrgId($orgId: uuid!) {
    org_by_pk(id: $orgId) {
      id
      name
      members {
        id
        userId
      }
    }
  }`)

const CREATE_ORG_SUBSCRIPTION = gql(`
  mutation createOrgSubscription($orgId: uuid!, $customerId: String!, $subscriptionId: String!, $type: subscription_plan_type_enum!) {
    insert_org_subscription_one(object: {
      orgId: $orgId
      stripeCustomerId: $customerId
      stripeSubscriptionId: $subscriptionId
      type: $type
    }) {
      id
    }
  }`)

const UPDATE_ORG_SUBSCRIPTION = gql(`
  mutation updateOrgSubscriptionStripeSubId($orgId: uuid!, $stripeSubscriptionId: String!, $type: subscription_plan_type_enum!) {
    update_org_subscription(where: {orgId: {_eq: $orgId}}, _set: {stripeSubscriptionId: $stripeSubscriptionId, type: $type}) {
      returning {
        id
      }
    }
  }`)

const GET_ORG_SUBSCRIPTION_STATUS = gql(`
  query getOrgSubscriptionStatus($orgId: uuid!) {
    org_subscription(where: {orgId: {_eq: $orgId}}) {
      id
      status
      stripeCustomerId
      stripeSubscriptionId
      type
    }
  }`)
