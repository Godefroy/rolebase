import ScrollableLayout from '@/common/atoms/ScrollableLayout'
import { Title } from '@/common/atoms/Title'
import useOrgAdmin from '@/member/hooks/useOrgAdmin'
import useOrgOwner from '@/member/hooks/useOrgOwner'
import { useOrgContext } from '@/org/contexts/OrgContext'
import { usePathInOrg } from '@/org/hooks/usePathInOrg'
import { Box, Flex, Heading, useMediaQuery, VStack } from '@chakra-ui/react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Outlet } from 'react-router'
import {
  ApiIcon,
  AppsIcon,
  CircleIcon,
  ExportIcon,
  NotificationIcon,
  UserInfoIcon,
} from 'src/icons'
import SidebarGroupTitle from './SidebarGroupTitle'
import SidebarItemLink from './SidebarItemLink'

const sidebarWidth = '250px'

export default function SettingsLayout() {
  const { t } = useTranslation()
  const pathBase = usePathInOrg('settings') || '/settings'
  const { orgId } = useOrgContext()
  const isAdmin = useOrgAdmin()
  const isOwner = useOrgOwner()
  const [isSmallScreen] = useMediaQuery('(max-width: 1024px)')

  return (
    <>
      <Title>{t('Settings.heading')}</Title>

      <ScrollableLayout
        header={
          <Flex ml={5} my={2} w="100%" alignItems="center" flexWrap="wrap">
            <Heading as="h1" size="lg">
              {t('Settings.heading')}
            </Heading>
          </Flex>
        }
      >
        <Flex
          minH="100%"
          flexDirection={isSmallScreen ? 'column' : 'row'}
          alignItems="stretch"
        >
          {/* Left Menu */}
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
            {/* Organization Section */}
            {(isAdmin || isOwner) && orgId && (
              <VStack align="stretch" spacing={1}>
                <SidebarGroupTitle>
                  {t('SettingsMenu.org.heading')}
                </SidebarGroupTitle>
                {isAdmin && (
                  <SidebarItemLink to={`${pathBase}/org`} icon={CircleIcon}>
                    {t('Settings.orgSettings')}
                  </SidebarItemLink>
                )}
                {isOwner && (
                  <SidebarItemLink to={`${pathBase}/export`} icon={ExportIcon}>
                    {t('Settings.export')}
                  </SidebarItemLink>
                )}
              </VStack>
            )}

            {/* User Section */}
            <VStack align="stretch" spacing={1}>
              <SidebarGroupTitle>
                {t('SettingsMenu.user.heading')}
              </SidebarGroupTitle>
              <SidebarItemLink
                to={`${pathBase}/credentials`}
                icon={UserInfoIcon}
              >
                {t('SettingsMenu.user.credentials')}
              </SidebarItemLink>
              <SidebarItemLink
                to={`${pathBase}/notifications`}
                icon={NotificationIcon}
              >
                {t('SettingsMenu.user.notifications')}
              </SidebarItemLink>
              <SidebarItemLink to={`${pathBase}/apps`} icon={AppsIcon}>
                {t('Settings.apps')}
              </SidebarItemLink>
              <SidebarItemLink to={`${pathBase}/api-keys`} icon={ApiIcon}>
                {t('Settings.api')}
              </SidebarItemLink>
            </VStack>

          </VStack>

          {/* Main Content */}
          <Box flex={1} h="100%" p={{ base: 5, sm: 10 }}>
            <Outlet />
          </Box>
        </Flex>
      </ScrollableLayout>
    </>
  )
}
