import useCurrentMember from '@/member/hooks/useCurrentMember'
import { useOrgContext } from '@/org/contexts/OrgContext'
import { useToast } from '@chakra-ui/react'
import { Subscription_Payment_Status_Enum } from '@gql'
import {
  Invoice,
  Subscription,
  findOpenInvoice,
} from '@rolebase/shared/model/subscription'
import React, { ReactNode, useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { track } from 'src/analytics'
import { trpc } from 'src/trpc'
import { SubscriptionContext } from './SubscriptionContext'

// Stripe prices are all set in euros in the dashboard; Umami's revenue report
// needs an explicit currency alongside the amount.
const CURRENCY = 'EUR'

const ACTIVE_STATUSES: Subscription_Payment_Status_Enum[] = [
  Subscription_Payment_Status_Enum.Active,
  Subscription_Payment_Status_Enum.Trialing,
]

interface Props {
  children: ReactNode
}

export default function SubscriptionProvider({ children }: Props) {
  const { t } = useTranslation()
  const { orgId, orgData } = useOrgContext()
  const currentMember = useCurrentMember()
  const currentMemberId = currentMember?.id
  const toast = useToast()
  const [loading, setLoading] = useState(true)
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [invoices, setInvoices] = useState<Invoice[]>([])

  const displayErrorToast = () => {
    toast({
      title: t('common.errorRetry'),
      description: t('common.errorContact'),
      duration: 10000,
      isClosable: true,
      status: 'error',
    })
  }

  const refetchSubscription = async () => {
    if (!orgId) return
    try {
      setSubscription(
        await trpc.orgSubscription.getSubscription.query({ orgId })
      )
    } catch (e) {
      displayErrorToast()
    }
  }

  const refetchInvoices = async () => {
    if (!orgId) return
    try {
      setInvoices(
        await trpc.orgSubscription.getSubscriptionInvoices.query({ orgId })
      )
    } catch (e) {
      displayErrorToast()
    }
  }

  // currentMember is a new object on every org data update, so depend on its id:
  // refetching here unmounts the tabs and would close an open payment modal
  useEffect(() => {
    if (!orgId || !currentMemberId) return

    setLoading(true)
    Promise.all([refetchSubscription(), refetchInvoices()]).finally(() =>
      setLoading(false)
    )
  }, [orgId, currentMemberId])

  // Conversion to a paying plan, caught on the status transition rather than
  // on the Stripe return: it covers the free/trial path (which reloads the
  // page) and a payment confirmed in another tab. The first observation only
  // records the baseline, so an already-paying org never fires it.
  const previousStatus = useRef<Subscription_Payment_Status_Enum | null>()
  useEffect(() => {
    if (loading) return
    const status = subscription?.status ?? null
    const previous = previousStatus.current
    previousStatus.current = status
    if (previous === undefined || previous === status || !status) return
    if (!ACTIVE_STATUSES.includes(status)) return

    track('subscription_activated', {
      plan: subscription?.type,
      status,
      revenue: (subscription?.upcomingInvoice?.totalInCents ?? 0) / 100,
      currency: CURRENCY,
      seats: orgData?.members.filter((member) => !!member.userId).length,
    })
  }, [loading, subscription?.status])

  const value = useMemo(
    () => ({
      subscription,
      invoices,
      openInvoice: findOpenInvoice(invoices),
      loading,
      refetchSubscription,
      refetchInvoices,
    }),
    [subscription, invoices, loading]
  )

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  )
}
