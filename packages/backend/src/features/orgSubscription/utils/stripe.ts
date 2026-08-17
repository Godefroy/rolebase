import { TRPCError } from '@trpc/server'
import Stripe from 'stripe'
import settings from '../../../settings'

export const stripe = new Stripe(settings.stripe.privateKey, {
  apiVersion: '2022-11-15',
})

const acceptedPaymentMethods: Stripe.SubscriptionCreateParams.PaymentSettings.PaymentMethodType[] =
  ['card', 'sepa_debit']

type StripeSubscriptionCreation = Stripe.Subscription & {
  latest_invoice: Stripe.Invoice & {
    payment_intent: Stripe.PaymentIntent
  }
}

export type ExtendedStripeCustomer = (
  | Stripe.Customer
  | Stripe.DeletedCustomer
) & {
  subscriptions: {
    data: Stripe.Subscription[]
  }
  invoice_settings: {
    default_payment_method: Stripe.PaymentMethod
  }
}

export const createStripeCustomer = async (
  email: string,
  name: string,
  address: Stripe.Emptyable<Stripe.AddressParam> | undefined
): Promise<Stripe.Customer> => {
  const customer = await stripe.customers.create({
    email,
    name,
    address,
  })

  return customer
}

export const getStripeCustomerFromCustomerId = async (
  stripeCustomerId: string
): Promise<Stripe.Customer | Stripe.DeletedCustomer> => {
  const customer = await stripe.customers.retrieve(stripeCustomerId)

  return customer
}

export const getStripeSubscriptionFromSubscriptionId = async (
  stripeSubscriptionId: string
): Promise<Stripe.Subscription> => {
  const subscription = await stripe.subscriptions.retrieve(stripeSubscriptionId)

  return subscription
}

export const getStripeExtendedCustomer = async (
  stripeCustomerId: string
): Promise<ExtendedStripeCustomer> => {
  const customer = await stripe.customers.retrieve(stripeCustomerId, {
    expand: [
      'invoice_settings.default_payment_method.card',
      'subscriptions.data',
    ],
  })

  return customer as unknown as ExtendedStripeCustomer
}

export const validateStripeSubscription = async (
  stripeSubscriptionId: string
) => {
  const stripeSubscription =
    await getStripeSubscriptionFromSubscriptionId(stripeSubscriptionId)

  if (!stripeSubscription) {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: 'No subscription',
    })
  }

  // Subscription has been canceled, we consider it as locked
  if (stripeSubscription.cancel_at) {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: 'Subscription has been canceled',
    })
  }

  return stripeSubscription
}

export const cancelStripeSubscription = async (
  stripeSubscriptionId: string
): Promise<Stripe.Subscription> => {
  const subscription = await stripe.subscriptions.update(stripeSubscriptionId, {
    cancel_at_period_end: true,
  })

  return subscription
}

export const getStripeCustomerInvoices = async (
  stripeCustomerId: string
): Promise<Stripe.ApiList<Stripe.Invoice>> => {
  const invoices = await stripe.invoices.list({
    customer: stripeCustomerId,
  })

  return invoices
}

export const getStripeCustomerOpenInvoice = async (
  stripeCustomerId: string
): Promise<Stripe.Invoice | null> => {
  const invoices = await stripe.invoices.list({
    customer: stripeCustomerId,
    status: 'open',
    limit: 1,
  })

  return invoices.data[0] ?? null
}

export const createStripeSubscription = async (
  orgId: string,
  stripeCustomerId: string,
  stripePriceId: string,
  quantity: number,
  promotionCode?: string | null
): Promise<StripeSubscriptionCreation> => {
  let coupon: Stripe.PromotionCode | undefined

  if (promotionCode) {
    coupon = await retrievePromotionCode(promotionCode)
  }

  const subscription = await stripe.subscriptions.create({
    customer: stripeCustomerId,
    items: [
      {
        price: stripePriceId,
        quantity,
      },
    ],
    metadata: {
      orgId,
    },
    promotion_code: coupon?.id,
    automatic_tax: { enabled: true },
    payment_behavior: 'default_incomplete',
    expand: ['latest_invoice.payment_intent'],
    payment_settings: {
      payment_method_types: acceptedPaymentMethods,
    },
  })

  return subscription as StripeSubscriptionCreation
}

export const updateStripeSubscription = async (
  stripeSubscriptionId: string,
  newQuantity: number
): Promise<Stripe.Subscription> => {
  const currentStripeSubscription =
    await validateStripeSubscription(stripeSubscriptionId)
  const subscription = await stripe.subscriptions.update(stripeSubscriptionId, {
    items: [
      {
        id: currentStripeSubscription.items.data[0].id,
        quantity: newQuantity,
      },
    ],
  })

  return subscription
}

export const getPricePreview = async (
  priceId: string,
  quantity: number,
  address: Stripe.Emptyable<Stripe.AddressParam> | undefined,
  promotionCode?: string | null
): Promise<{
  price: Stripe.UpcomingInvoice
  coupon: Stripe.PromotionCode | undefined
}> => {
  let coupon: Stripe.PromotionCode | undefined

  if (promotionCode) {
    coupon = await retrievePromotionCode(promotionCode)
  }

  const price = await stripe.invoices.retrieveUpcoming({
    customer_details: {
      address,
    },
    subscription_items: [{ price: priceId, quantity }],
    automatic_tax: { enabled: true },
    expand: ['total_tax_amounts.tax_rate'],
  })

  return { price, coupon }
}

export const retrievePromotionCode = async (
  promotionCode: string
): Promise<Stripe.PromotionCode> => {
  const promoCodes = await stripe.promotionCodes.list({
    active: true,
    code: promotionCode,
  })

  if (!promoCodes.data[0]) {
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: 'Promo code does not exists',
    })
  }

  return promoCodes.data[0]
}

export const updateStripeCustomer = async (
  stripeCustomerId: string,
  fieldsToUpdate: Stripe.CustomerUpdateParams
): Promise<Stripe.Customer | Stripe.DeletedCustomer> => {
  const customer = await stripe.customers.update(
    stripeCustomerId,
    fieldsToUpdate
  )

  return customer
}

export const createStripeSetupIntent = async (
  stripeCustomerId: string
): Promise<Stripe.SetupIntent> => {
  const intent = await stripe.setupIntents.create({
    customer: stripeCustomerId,
    payment_method_types: acceptedPaymentMethods,
  })

  return intent
}

export const getStripeUpcomingInvoice = async (
  stripeSubscriptionId: string
): Promise<Stripe.UpcomingInvoice | null> => {
  try {
    const invoice = await stripe.invoices.retrieveUpcoming({
      subscription: stripeSubscriptionId,
    })

    return invoice
  } catch (e) {
    if (
      e instanceof Stripe.errors.StripeError &&
      e.code === 'invoice_upcoming_none'
    ) {
      return null
    }
    throw e
  }
}

export const deleteStripeSubscription = async (
  stripeSubscriptionId: string
): Promise<Stripe.Subscription> => {
  const subscription = await stripe.subscriptions.del(stripeSubscriptionId)

  return subscription
}

export const stripeResumeSubscription = async (
  stripeSubscriptionId: string
): Promise<Stripe.Subscription> => {
  const subscription = await stripe.subscriptions.update(stripeSubscriptionId, {
    cancel_at_period_end: false,
  })

  return subscription
}
