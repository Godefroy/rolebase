import { usePathInOrg } from '@/org/hooks/usePathInOrg'
import { useOrgContext } from '@/org/contexts/OrgContext'
import {
  Box,
  Collapse,
  Flex,
  IconButton,
  Link,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Progress,
  Spacer,
  Text,
  VStack,
} from '@chakra-ui/react'
import { UserLocalStorageKeys } from '@utils/localStorage'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { track } from 'src/analytics'
import { ChevronDownIcon, ChevronUpIcon, MoreIcon } from 'src/icons'
import useOnboardingTodo from '../hooks/useOnboardingTodo'
import { BOOK_DEMO_URL } from '../onboardingTodo'
import OnboardingTodoInviteItem from './OnboardingTodoInviteItem'
import OnboardingTodoItem from './OnboardingTodoItem'
import OnboardingTodoRecurringItem from './OnboardingTodoRecurringItem'

// "Getting started" group at the top of the sidebar: what the mandatory setup
// does not ask for, ordered by value (the team, then its meeting rhythm, then
// the finishing touches). Disappears once completed or dismissed.
export default function OnboardingTodo() {
  const { t } = useTranslation()
  const { orgId } = useOrgContext()
  const rootPath = usePathInOrg('')
  const { visible, loading, items, doneCount, total, dismiss } =
    useOnboardingTodo()

  // Folding is a per-viewer convenience, remembered in this browser
  const collapsedKey = UserLocalStorageKeys.OnboardingTodoCollapsed.replace(
    '{id}',
    orgId ?? ''
  )
  const [collapsed, setCollapsed] = useState(() => {
    try {
      return localStorage.getItem(collapsedKey) === '1'
    } catch {
      return false
    }
  })

  const handleToggle = () => {
    const next = !collapsed
    setCollapsed(next)
    try {
      localStorage.setItem(collapsedKey, next ? '1' : '0')
    } catch {
      // Storage unavailable: the state only lives in memory
    }
  }

  const handleBookDemo = () => track('book_demo_clicked', { source: 'todo' })

  if (!visible || loading) return null

  return (
    <Box
      as="section"
      aria-label={t('OnboardingTodo.title')}
      mb={3}
      p={3}
      borderRadius="xl"
      bg="white"
      _dark={{ bg: 'whiteAlpha.100' }}
    >
      <Flex align="center" gap={2}>
        <Text fontSize="sm" fontWeight="semibold">
          {t('OnboardingTodo.title')}
        </Text>
        <Text fontSize="xs" color="gray.500" _dark={{ color: 'gray.400' }}>
          {doneCount} / {total}
        </Text>
        <Spacer />
        <IconButton
          aria-label={t(
            collapsed ? 'OnboardingTodo.expand' : 'OnboardingTodo.collapse'
          )}
          aria-expanded={!collapsed}
          icon={
            collapsed ? (
              <ChevronDownIcon size={16} />
            ) : (
              <ChevronUpIcon size={16} />
            )
          }
          size="xs"
          variant="ghost"
          onClick={handleToggle}
        />
        <Menu placement="bottom-end">
          <MenuButton
            as={IconButton}
            aria-label={t('OnboardingTodo.menu')}
            icon={<MoreIcon size={16} />}
            size="xs"
            variant="ghost"
          />
          <MenuList zIndex={10} shadow="lg" fontSize="sm">
            <MenuItem onClick={dismiss}>{t('OnboardingTodo.dismiss')}</MenuItem>
          </MenuList>
        </Menu>
      </Flex>

      <Progress
        value={(doneCount / total) * 100}
        size="xs"
        colorScheme="green"
        borderRadius="full"
        mt={2}
        aria-hidden
      />

      <Collapse in={!collapsed} animateOpacity>
        <VStack spacing={0} align="stretch" mt={2}>
          <OnboardingTodoItem
            done={items.orgChart}
            label={t('OnboardingTodo.items.orgChart')}
            to={`${rootPath}roles`}
          />
          <OnboardingTodoInviteItem done={items.invite} />
          <OnboardingTodoRecurringItem done={items.recurringMeeting} />
          <OnboardingTodoItem
            done={items.meeting}
            label={t('OnboardingTodo.items.meeting')}
            to={`${rootPath}meetings`}
          />
          <OnboardingTodoItem
            done={items.thread}
            label={t('OnboardingTodo.items.thread')}
            to={`${rootPath}threads`}
          />
          <OnboardingTodoItem
            done={items.photos}
            label={t('OnboardingTodo.items.photos')}
            to={`${rootPath}settings/members`}
          />
        </VStack>

        {/* Outside the counter: nobody should have to book a demo to finish */}
        <Link
          href={BOOK_DEMO_URL}
          isExternal
          display="block"
          mt={2}
          pt={2}
          px={2}
          borderTopWidth="1px"
          fontSize="sm"
          color="blue.600"
          _dark={{ color: 'blue.300' }}
          onClick={handleBookDemo}
        >
          {t('OnboardingTodo.bookDemo')}
        </Link>
      </Collapse>
    </Box>
  )
}
