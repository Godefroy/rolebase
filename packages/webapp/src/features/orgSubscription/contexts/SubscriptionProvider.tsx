import useCurrentMember from '@/member/hooks/useCurrentMember'
import { useOrgContext } from '@/org/contexts/OrgContext'
import { useToast } from '@chakra-ui/react'
import {
  Invoice,
  Subscription,
  findOpenInvoice,
} from '@rolebase/shared/model/subscription'
import React, { ReactNode, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { trpc } from 'src/trpc'
import { SubscriptionContext } from './SubscriptionContext'

interface Props {
  children: ReactNode
}

export default function SubscriptionProvider({ children }: Props) {
  const { t } = useTranslation()
  const { orgId } = useOrgContext()
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
