import { Invoice, Subscription } from '@rolebase/shared/model/subscription'
import { createContext, useContext } from 'react'

export interface SubscriptionContextValue {
  subscription: Subscription | null
  invoices: Invoice[]
  // Invoice awaiting payment, blocking any subscription change
  openInvoice: Invoice | undefined
  // True until the first fetch resolves. Refetches keep the data displayed,
  // otherwise unmounting the tabs would close the payment modal.
  loading: boolean
  refetchSubscription(): void
  refetchInvoices(): void
}

const defaultValue: SubscriptionContextValue = {
  subscription: null,
  invoices: [],
  openInvoice: undefined,
  loading: true,
  refetchSubscription: () => undefined,
  refetchInvoices: () => undefined,
}

export const SubscriptionContext =
  createContext<SubscriptionContextValue>(defaultValue)

export function useSubscriptionContext(): SubscriptionContextValue {
  return useContext(SubscriptionContext)
}
