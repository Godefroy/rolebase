import Stripe from 'stripe'
import {
  Org_Subscription,
  OrgSubscriptionFragment,
  Subscription_Payment_Status_Enum,
  Subscription_Plan_Type_Enum,
} from '../gql'

export const SubscriptionLimits = {
  free: 5,
  [Subscription_Plan_Type_Enum.Startup]: Infinity,
  [Subscription_Plan_Type_Enum.Business]: Infinity,
} satisfies Record<Subscription_Plan_Type_Enum | 'free', number>

export type SubscriptionIntentResponse = {
  subscriptionId: string
  clientSecret: string
  isFreeOrTrial: boolean
  price: {
    quantity: number
    totalPerSeatInCents: number
  }
}

export enum InvoiceStatus {
  PAID = 'paid',
  DRAFT = 'draft',
  OPEN = 'open',
  UNCOLLECTIBLE = 'uncollectible',
  VOID = 'void',
}

export type UpcomingInvoice = {
  nextPayment: string
  totalInCents: number
}

export type Invoice = {
  id: string
  createdAt: string
  pdfUrl?: string | null | undefined
  // Stripe hosted page where the invoice can be paid
  hostedUrl?: string | null | undefined
  totalInCents: number
  status: InvoiceStatus
}

export type SubscriptionCard = {
  expMonth: number
  expYear: number
  brand: string
  last4: string
}

export type CustomerBillingDetails = {
  name?: string | null | undefined
  email?: string | null | undefined
  address?: Stripe.Address | null | undefined
}

export type Subscription = {
  card: SubscriptionCard | null
  upcomingInvoice: UpcomingInvoice | null
  expiresAt: string | null
  billingDetails: CustomerBillingDetails | null
} & Pick<Org_Subscription, 'status' | 'orgId' | 'type'>

export type PromotionCode = {
  id: string
  restrictions: Stripe.PromotionCode.Restrictions
  duration: {
    type: Stripe.Coupon.Duration
    durationInMonth: number | null
  }
  name: string
  amountOff: number | null
  percentOff: number | null
}

export type PricePreview = {
  subTotalPerSeatInCents: number
  quantity: number
  promotionCode: PromotionCode | null
  tax: {
    percentage: number
    amount: number
  } | null
}

// Invoice awaiting payment, blocking any subscription change
export function findOpenInvoice(
  invoices: Invoice[] | undefined
): Invoice | undefined {
  return invoices?.find((invoice) => invoice.status === InvoiceStatus.OPEN)
}

export function isSubscriptionActive(
  status: Subscription_Payment_Status_Enum | null | undefined
): boolean {
  return (
    status === Subscription_Payment_Status_Enum.Active ||
    status === Subscription_Payment_Status_Enum.Trialing
  )
}

export function getSeatsBySubscriptionType(
  type?: Subscription_Plan_Type_Enum
): number {
  return (type && SubscriptionLimits[type]) || SubscriptionLimits.free
}

export function getSubscriptionSeats(
  subscription: OrgSubscriptionFragment | null | undefined
): number {
  return getSeatsBySubscriptionType(
    isSubscriptionActive(subscription?.status) ? subscription?.type : undefined
  )
}

export function checkSubscriptionSeats(
  subscription: OrgSubscriptionFragment | null | undefined,
  seats: number
): boolean {
  return getSubscriptionSeats(subscription) >= seats
}
