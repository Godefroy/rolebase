import Tab from '@/common/atoms/Tab'
import useCurrentMember from '@/member/hooks/useCurrentMember'
import { useOrgContext } from '@/org/contexts/OrgContext'
import {
  Box,
  Flex,
  FlexProps,
  HStack,
  Spinner,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  useToast,
} from '@chakra-ui/react'
import { Invoice, Subscription } from '@rolebase/shared/model/subscription'
import React, { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FileIcon, MemberIcon, SubscriptionIcon } from 'src/icons'
import { trpc } from 'src/trpc'
import AccountTab from './AccountTab'
import InvoiceTab from './InvoiceTab'
import SubscriptionTab from './SubscriptionTab'

export default function SubscriptionTabs(props: FlexProps) {
  const { t } = useTranslation()
  const { orgId } = useOrgContext()
  const currentMember = useCurrentMember()
  const toast = useToast()
  const [subscriptionLoading, setSubscriptionLoading] = useState(true)
  const [invoicesLoading, setInvoicesLoading] = useState(true)
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [invoices, setInvoices] = useState<Invoice[]>([])

  useEffect(() => {
    if (orgId && currentMember) {
      getData()
    }
  }, [orgId, currentMember])

  const getData = () => {
    getSubscriptionData()
    getInvoicesData()
  }

  const getSubscriptionData = async () => {
    setSubscriptionLoading(true)
    try {
      const res = await trpc.orgSubscription.getSubscription.query({
        orgId: orgId!,
      })

      setSubscription(res)
    } catch (e) {
      displayErrorToast()
    } finally {
      setSubscriptionLoading(false)
    }
  }

  const getInvoicesData = async () => {
    setInvoicesLoading(true)
    try {
      const res = await trpc.orgSubscription.getSubscriptionInvoices.query({
        orgId: orgId!,
      })

      setInvoices(res)
    } catch (e) {
      displayErrorToast()
    } finally {
      setInvoicesLoading(false)
    }
  }

  const displayErrorToast = () => {
    toast({
      title: t('common.errorRetry'),
      description: t('common.errorContact'),
      duration: 10000,
      isClosable: true,
      status: 'error',
    })
  }

  const TabSpinner = useMemo(
    () => (
      <HStack w="100%" justifyContent="center" pt="12">
        <Spinner size="xl" />
      </HStack>
    ),
    []
  )

  return (
    <Flex {...props}>
      <Tabs w="100%" colorScheme="gray">
        <Box overflowX="auto" bg="menulight" _dark={{ bg: 'menudark' }}>
          <TabList pl={7} pb={3}>
            <Tab icon={SubscriptionIcon}>
              {t('SubscriptionTabs.subscriptionTabTitle')}
            </Tab>
            <Tab icon={MemberIcon}>{t('SubscriptionTabs.accountTabTitle')}</Tab>
            <Tab icon={FileIcon}>{t('SubscriptionTabs.invoicesTabTitle')}</Tab>
          </TabList>
        </Box>
        <TabPanels>
          <TabPanel w="100%">
            {subscriptionLoading && TabSpinner}
            {!subscriptionLoading && (
              <SubscriptionTab
                subscription={subscription}
                onSubscriptionUpdated={getSubscriptionData}
              />
            )}
          </TabPanel>
          <TabPanel>
            {subscriptionLoading && TabSpinner}
            {!subscriptionLoading && (
              <AccountTab
                subscription={subscription}
                onAccountUpdated={getSubscriptionData}
              />
            )}
          </TabPanel>
          <TabPanel>
            {invoicesLoading && TabSpinner}
            {!invoicesLoading && <InvoiceTab invoices={invoices} />}
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Flex>
  )
}
