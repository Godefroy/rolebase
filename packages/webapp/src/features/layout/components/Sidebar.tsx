import {
  AVATAR_SM_WIDTH,
  getResizedImageUrl,
} from '@rolebase/shared/helpers/getResizedImageUrl'
import useCurrentMember from '@/member/hooks/useCurrentMember'
import useOrgAdmin from '@/member/hooks/useOrgAdmin'
import OnboardingTodo from '@/onboarding/components/OnboardingTodo'
import OnboardingTodoCompactButton from '@/onboarding/components/OnboardingTodoCompactButton'
import OrgSwitch from '@/org/components/OrgSwitch'
import { useOrgContext } from '@/org/contexts/OrgContext'
import { usePathInOrg } from '@/org/hooks/usePathInOrg'
import SearchGlobalModal from '@/search/components/SearchGlobalModal'
import { useAuth } from '@/user/hooks/useAuth'
import {
  Avatar,
  Box,
  Flex,
  Menu,
  MenuButton,
  Spacer,
  useDisclosure,
} from '@chakra-ui/react'
import { useStoreState } from '@store/hooks'
import React, { useContext, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import {
  BackIcon,
  HelpIcon,
  MenuIcon,
  NewsIcon,
  OrgChartIcon,
  SearchIcon,
  SettingsIcon,
  SidebarLeftIcon,
  SidebarRightIcon,
} from 'src/icons'
import { SidebarContext } from '../contexts/SidebarContext'
import HelpMenuList from './HelpMenuList'
import SidebarItem from './SidebarItem'
import SidebarItemLink from './SidebarItemLink'
import SidebarLayout from './SidebarLayout'
import SidebarMeetings from './SidebarMeetings'
import SidebarSearchField from './SidebarSearchField'
import SidebarTasks from './SidebarTasks'
import SidebarThreads from './SidebarThreads'
import SidebarTopIcon from './SidebarTopIcon'
import UserSettingsMenuList from './UserSettingsMenuList'

// Force reset with fast refresh
// @refresh reset

export default function Sidebar() {
  const { t } = useTranslation()
  const { isAuthenticated, user } = useAuth()
  const { orgId } = useOrgContext()
  const orgLoading = useStoreState((state) => state.orgs.loading)
  const currentMember = useCurrentMember()
  const isAdmin = useOrgAdmin()

  // User display name and avatar
  const displayName = currentMember?.name || user?.displayName || ''
  const avatarSrc = currentMember?.picture
    ? getResizedImageUrl(currentMember.picture, AVATAR_SM_WIDTH) || undefined
    : undefined

  // Get Sidebar context
  const context = useContext(SidebarContext)
  if (!context) {
    throw new Error('SidebarContext not found in Sidebar')
  }
  const { isMobile, expand, toggleCollapse, compact, height } = context

  // Links
  const rootPath = usePathInOrg('')

  // Search modal
  const searchModal = useDisclosure()

  // Use Cmd+P keys to open search
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'p' && (event.ctrlKey || event.metaKey)) {
        event.preventDefault()
        searchModal.onOpen()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  const handleSearchClose = () => {
    searchModal.onClose()
    expand.onClose()
  }

  if (!isAuthenticated) return null

  // Main navigation, as rows or icons depending on the compact mode
  const navigation = orgId && (
    <>
      <SidebarItemLink to={`${rootPath}news`} icon={NewsIcon} compact={compact}>
        {t('Sidebar.news')}
      </SidebarItemLink>

      <SidebarItemLink
        to={`${rootPath}roles`}
        icon={OrgChartIcon}
        compact={compact}
      >
        {t('Sidebar.roles')}
      </SidebarItemLink>

      <SidebarMeetings />
      <SidebarThreads />
      <SidebarTasks />
    </>
  )

  return (
    <SidebarLayout>
      {isMobile ? (
        /* Mobile: top bar with org, links and menu */
        <Flex h={`${height}px`} flexShrink={0} pr={2} align="center" gap={0.5}>
          <OrgSwitch flex={compact ? undefined : 1} minW={0} />
          {compact && (
            <>
              <Spacer />
              {navigation}
            </>
          )}
          <SidebarTopIcon
            icon={MenuIcon}
            isActive={expand.isOpen}
            onClick={expand.onToggle}
          >
            {t('Sidebar.menu')}
          </SidebarTopIcon>
        </Flex>
      ) : (
        /* Desktop: org and collapse button */
        <Flex
          direction={compact ? 'column' : 'row'}
          align="center"
          gap={1}
          pt={3}
          pb={2}
          px={compact ? 0 : 3}
        >
          <OrgSwitch flex={compact ? undefined : 1} minW={0} />
          <SidebarTopIcon
            icon={compact ? SidebarRightIcon : SidebarLeftIcon}
            color="gray.500"
            onClick={toggleCollapse}
          >
            {t(compact ? 'Sidebar.expand' : 'Sidebar.collapse')}
          </SidebarTopIcon>
        </Flex>
      )}

      {!(isMobile && compact) && (
        /* Sidebar content: rows, or icons when collapsed */
        <Flex
          flex={1}
          flexDirection="column"
          alignItems={compact ? 'center' : 'stretch'}
          gap={compact ? 1 : 0}
          px={compact ? 0 : { base: 2, md: 3 }}
          pt={compact ? 1 : 2}
          pb={3}
          overflowY={{
            base: 'auto',
            md: 'hidden', // Hide scrollbar on desktop
          }}
          _hover={{
            // Show scrollbar on hover
            overflowY: 'auto',
          }}
        >
          {!orgId && !orgLoading && window.location.pathname !== '/' && (
            <SidebarItemLink to="/" icon={BackIcon} compact={compact}>
              {t('Sidebar.orgs')}
            </SidebarItemLink>
          )}

          {orgId &&
            (compact ? (
              <>
                <SidebarTopIcon
                  iconNode={<SearchIcon size={20} />}
                  onClick={searchModal.onOpen}
                >
                  {t('Sidebar.search')}
                </SidebarTopIcon>
                <OnboardingTodoCompactButton />
                <Box
                  w="28px"
                  h="1px"
                  my={2}
                  bg="gray.200"
                  _dark={{ bg: 'whiteAlpha.200' }}
                />
              </>
            ) : (
              <>
                <SidebarSearchField
                  showShortcut={!isMobile}
                  onClick={searchModal.onOpen}
                />
                <OnboardingTodo />
              </>
            ))}

          {navigation}

          <Spacer minH={4} />

          <SidebarItemLink
            to={
              isAdmin
                ? `${rootPath}settings/org`
                : `${rootPath}settings/credentials`
            }
            activePath={`${rootPath}settings`}
            icon={SettingsIcon}
            compact={compact}
          >
            {t('Sidebar.settings')}
          </SidebarItemLink>

          <Menu placement="right-end">
            <MenuButton as={SidebarItem} icon={HelpIcon} compact={compact}>
              {t('Sidebar.help')}
            </MenuButton>
            <HelpMenuList />
          </Menu>

          <Menu placement="right-end">
            <MenuButton
              as={SidebarItem}
              compact={compact}
              iconNode={
                <Avatar
                  name={displayName}
                  src={avatarSrc}
                  size="sm"
                  w="24px"
                  h="24px"
                />
              }
            >
              {displayName}
            </MenuButton>
            <UserSettingsMenuList />
          </Menu>
        </Flex>
      )}

      {searchModal.isOpen && (
        <SearchGlobalModal isOpen onClose={handleSearchClose} />
      )}
    </SidebarLayout>
  )
}
