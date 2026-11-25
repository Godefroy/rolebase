import useCurrentMember from '@/member/hooks/useCurrentMember'
import useOrgMember from '@/member/hooks/useOrgMember'
import { usePathInOrg } from '@/org/hooks/usePathInOrg'
import ThreadItem from '@/thread/components/ThreadItem'
import useFilterThreadsByMember from '@/thread/hooks/useFilterThreadsByMember'
import useThreads from '@/thread/hooks/useThreads'
import ThreadEditModal from '@/thread/modals/ThreadEditModal'
import { useDisclosure } from '@chakra-ui/react'
import React, { useContext, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { ThreadsIcon } from 'src/icons'
import { SidebarContext } from '../contexts/SidebarContext'
import { sidebarSubItemProps } from './SidebarItem'
import SidebarItemLink from './SidebarItemLink'
import SidebarItemsContainer from './SidebarItemsContainer'
import SidebarSeeAllLink from './SidebarSeeAllLink'

const maxThreads = 5

// Threads link, with my unread threads below
export default function SidebarThreads() {
  const { t } = useTranslation()
  const sidebarContext = useContext(SidebarContext)
  const compact = !!sidebarContext?.compact
  const currentMember = useCurrentMember()
  const isMember = useOrgMember()
  const threadsPath = usePathInOrg('threads')
  const listPath = `${threadsPath}?member=${currentMember?.id || ''}`
  const createModal = useDisclosure()

  // Subscribe to threads
  const { threads } = useThreads()
  const myThreads = useFilterThreadsByMember(threads, currentMember?.id)
  const unreadThreads = useMemo(
    () => myThreads?.filter((thread) => thread.read === false) ?? [],
    [myThreads]
  )
  const shownThreads = unreadThreads.slice(0, maxThreads)
  const threadsCount = myThreads?.length ?? 0

  return (
    <>
      <SidebarItemLink
        to={listPath}
        activePath={threadsPath}
        icon={ThreadsIcon}
        alert={unreadThreads.length > 0}
        compact={compact}
        onAdd={isMember ? createModal.onOpen : undefined}
      >
        {t('Sidebar.threads')}
      </SidebarItemLink>

      {!compact && threadsCount > 0 && (
        <SidebarItemsContainer>
          {/* All unread: shown without the unread style */}
          {shownThreads.map((thread) => (
            <ThreadItem
              key={thread.id}
              thread={thread}
              showIcon
              noModal
              {...sidebarSubItemProps}
            />
          ))}
          {threadsCount > shownThreads.length && (
            <SidebarSeeAllLink to={listPath}>
              {t('Sidebar.seeAllThreads', { count: threadsCount })}
            </SidebarSeeAllLink>
          )}
        </SidebarItemsContainer>
      )}

      {createModal.isOpen && (
        <ThreadEditModal isOpen onClose={createModal.onClose} />
      )}
    </>
  )
}
