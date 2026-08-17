import Tab from '@/common/atoms/Tab'
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
} from '@chakra-ui/react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { FileIcon, MemberIcon, SubscriptionIcon } from 'src/icons'
import { useSubscriptionContext } from '../contexts/SubscriptionContext'
import AccountTab from './AccountTab'
import InvoiceTab from './InvoiceTab'
import SubscriptionTab from './SubscriptionTab'

export default function SubscriptionTabs(props: FlexProps) {
  const { t } = useTranslation()
  const { loading } = useSubscriptionContext()

  if (loading) {
    return (
      <HStack w="100%" justifyContent="center" pt="12">
        <Spinner size="xl" />
      </HStack>
    )
  }

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
            <SubscriptionTab />
          </TabPanel>
          <TabPanel>
            <AccountTab />
          </TabPanel>
          <TabPanel>
            <InvoiceTab />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Flex>
  )
}
