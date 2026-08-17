import ScrollableLayout from '@/common/atoms/ScrollableLayout'
import { Title } from '@/common/atoms/Title'
import { Box, Flex, Heading, useMediaQuery, VStack } from '@chakra-ui/react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Outlet } from 'react-router'
import useSettingsLinks from '../hooks/useSettingsLinks'
import SettingsMenu from './SettingsMenu'
import SidebarGroupTitle from './SidebarGroupTitle'
import SidebarItemLink from './SidebarItemLink'

const sidebarWidth = '250px'

export default function SettingsLayout() {
  const { t } = useTranslation()
  const groups = useSettingsLinks()
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
          {/* Navigation: dropdown on small screens, sidebar otherwise */}
          {isSmallScreen ? (
            <Box
              px={5}
              py={3}
              borderBottom="1px"
              borderColor="gray.200"
              _dark={{ borderColor: 'gray.700' }}
            >
              <SettingsMenu />
            </Box>
          ) : (
            <VStack
              w={sidebarWidth}
              bg="white"
              borderRight="1px"
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
              {groups.map((group) => (
                <VStack key={group.title} align="stretch" spacing={1}>
                  <SidebarGroupTitle>{group.title}</SidebarGroupTitle>

                  {group.links.map((link) => (
                    <SidebarItemLink
                      key={link.to}
                      to={link.to}
                      icon={link.icon}
                    >
                      {link.label}
                    </SidebarItemLink>
                  ))}
                </VStack>
              ))}
            </VStack>
          )}

          {/* Main Content */}
          <Box flex={1} h="100%" p={{ base: 5, sm: 10 }}>
            <Outlet />
          </Box>
        </Flex>
      </ScrollableLayout>
    </>
  )
}
