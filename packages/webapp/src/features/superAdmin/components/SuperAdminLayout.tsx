import ScrollableLayout from '@/common/atoms/ScrollableLayout'
import { Title } from '@/common/atoms/Title'
import SidebarGroupTitle from '@/layout/components/SidebarGroupTitle'
import SidebarItemLink from '@/layout/components/SidebarItemLink'
import { ApolloProvider } from '@apollo/client'
import { Box, Flex, Heading, useMediaQuery, VStack } from '@chakra-ui/react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Outlet } from 'react-router'
import { createApolloClient } from 'src/apolloClient'
import { ExportIcon, MembersIcon, NewsIcon, SuperAdminIcon } from 'src/icons'
import AdminOrgDrawer from './AdminOrgDrawer'
import AdminUserDrawer from './AdminUserDrawer'

const sidebarWidth = '250px'

const adminApolloClient = createApolloClient({
  'x-hasura-role': 'admin',
})

export default function SuperAdminLayout() {
  const { t } = useTranslation()
  const [isSmallScreen] = useMediaQuery('(max-width: 1024px)')

  return (
    <ApolloProvider client={adminApolloClient}>
      <Title>{t('SuperAdmin.heading')}</Title>

      <ScrollableLayout
        header={
          <Flex ml={5} my={2} w="100%" alignItems="center" flexWrap="wrap">
            <Heading as="h1" size="lg">
              {t('SuperAdmin.heading')}
            </Heading>
          </Flex>
        }
      >
        <Flex
          minH="100%"
          flexDirection={isSmallScreen ? 'column' : 'row'}
          alignItems="stretch"
        >
          <VStack
            w={isSmallScreen ? 'full' : sidebarWidth}
            bg="white"
            borderRight={isSmallScreen ? 'none' : '1px'}
            borderBottom={isSmallScreen ? '1px' : 'none'}
            borderColor="gray.200"
            py={4}
            px={3}
            align="stretch"
            spacing={3}
            _dark={{
              bg: 'gray.800',
              borderColor: 'gray.700',
            }}
          >
            <VStack align="stretch" spacing={1}>
              <SidebarGroupTitle>{t('SuperAdmin.heading')}</SidebarGroupTitle>
              <SidebarItemLink to="/admin" icon={NewsIcon}>
                {t('SuperAdmin.sidebar.dashboard')}
              </SidebarItemLink>
              <SidebarItemLink to="/admin/orgs" icon={SuperAdminIcon}>
                {t('SuperAdmin.sidebar.orgs')}
              </SidebarItemLink>
              <SidebarItemLink to="/admin/users" icon={MembersIcon}>
                {t('SuperAdmin.sidebar.users')}
              </SidebarItemLink>
              <SidebarItemLink to="/admin/maintenance" icon={ExportIcon}>
                {t('SuperAdmin.sidebar.maintenance')}
              </SidebarItemLink>
            </VStack>
          </VStack>

          <Box flex={1} h="100%" p={{ base: 5, sm: 10 }}>
            <Outlet />
          </Box>
        </Flex>
      </ScrollableLayout>

      <AdminOrgDrawer />
      <AdminUserDrawer />
    </ApolloProvider>
  )
}
