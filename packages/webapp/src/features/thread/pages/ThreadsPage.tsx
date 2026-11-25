import useHasRoomForColumns from '@/layout/hooks/useHasRoomForColumns'
import CircleAndMemberFilters from '@/circle/components/CircleAndMemberFilters'
import useFilterEntitiesByCircle from '@/circle/hooks/useFilterEntitiesByCircle'
import Loading from '@/common/atoms/Loading'
import IconTextButton from '@/common/atoms/IconTextButton'
import PageHeader, { pageHeaderButtonSize } from '@/common/atoms/PageHeader'
import ScrollableLayout from '@/common/atoms/ScrollableLayout'
import TextErrors from '@/common/atoms/TextErrors'
import { Title } from '@/common/atoms/Title'
import useOverflowHidden from '@/common/hooks/useOverflowHidden'
import useUpdatableQueryParams from '@/common/hooks/useUpdatableQueryParams'
import { SidebarContext } from '@/layout/contexts/SidebarContext'
import useOrgMember from '@/member/hooks/useOrgMember'
import OnboardingVideo, {
  OnboardingVideoType,
} from '@/onboarding/components/OnboardingVideo'
import {
  Box,
  Button,
  Flex,
  Menu,
  MenuButton,
  MenuItemOption,
  MenuList,
  MenuOptionGroup,
  useDisclosure,
} from '@chakra-ui/react'
import { Thread_Status_Enum } from '@gql'
import { threadStatusList } from '@rolebase/shared/model/thread'
import React, { useCallback, useContext, useState } from 'react'
import { Outlet, useParams } from 'react-router'
import { useTranslation } from 'react-i18next'
import { AddIcon, ChevronDownIcon } from 'src/icons'
import ThreadsList from '../components/ThreadsList'
import useFilterThreadsByMember from '../hooks/useFilterThreadsByMember'
import useThreads from '../hooks/useThreads'
import ThreadEditModal from '../modals/ThreadEditModal'

// Room needed for the list and a thread side by side
const threadsColumnsMinWidth = 920

type Params = {
  member: string
  circle: string
}

// Thread Status filter
const threadStatusNotClosed = 'NotClosed'
type ThreadStatusFilter = Thread_Status_Enum | typeof threadStatusNotClosed

const threadStatusFiltersList: ThreadStatusFilter[] = [
  threadStatusNotClosed,
  ...threadStatusList,
]

export default function ThreadsPage() {
  const { t } = useTranslation()
  const { params, changeParams } = useUpdatableQueryParams<Params>()
  const isMember = useOrgMember()
  const sidebarContext = useContext(SidebarContext)

  // Selected thread: next to the list on desktop, in its place on mobile
  const { threadId } = useParams<{ threadId: string }>()
  const hasColumns = useHasRoomForColumns(threadsColumnsMinWidth)
  useOverflowHidden()

  // Member param
  const memberId =
    params.member && typeof params.member === 'string'
      ? params.member
      : undefined
  const handleMemberChange = (member: string | undefined) =>
    changeParams({ member })

  // Circle param
  const circleId =
    params.circle && typeof params.circle === 'string'
      ? params.circle
      : undefined
  const handleCircleChange = (circle: string | undefined) =>
    changeParams({ circle })

  // Status filter
  const [status, setStatus] = useState<Thread_Status_Enum | undefined>()

  // Subscribe to threads
  const { threads, error, loading } = useThreads({ status })

  // Filter threads
  const filteredByCircleThreads = useFilterEntitiesByCircle(threads, circleId)
  const filteredThreads = useFilterThreadsByMember(
    filteredByCircleThreads,
    memberId
  )

  // Create modal
  const {
    isOpen: isCreateOpen,
    onOpen: onCreateOpen,
    onClose: onCreateClose,
  } = useDisclosure()

  const handleThreadStatusChange = useCallback((status: string | string[]) => {
    if (typeof status !== 'string') return
    setStatus(
      status === threadStatusNotClosed
        ? undefined
        : (status as Thread_Status_Enum)
    )
  }, [])

  // Mobile: the selected thread replaces the list
  if (threadId && !hasColumns) return <Outlet />

  const list = (
    <>
      {!threadId && <Title>{t('ThreadsPage.heading')}</Title>}

      <ScrollableLayout
        beigeContent
        header={
          <PageHeader
            ml={5}
            title={t('ThreadsPage.heading')}
            filters={
              <CircleAndMemberFilters
                circleId={circleId}
                memberId={memberId}
                my={2}
                onCircleChange={handleCircleChange}
                onMemberChange={handleMemberChange}
              >
                <Menu>
                  <MenuButton
                    as={Button}
                    rightIcon={<ChevronDownIcon size="1em" />}
                    fontWeight="normal"
                  >
                    {t(
                      `common.threadStatus.${status ?? threadStatusNotClosed}`
                    )}
                  </MenuButton>
                  <MenuList zIndex={2000}>
                    <MenuOptionGroup
                      type="radio"
                      value={status ?? threadStatusNotClosed}
                      onChange={handleThreadStatusChange}
                    >
                      {threadStatusFiltersList.map((status) => (
                        <MenuItemOption key={status} value={status}>
                          {t(`common.threadStatus.${status}`)}
                        </MenuItemOption>
                      ))}
                    </MenuOptionGroup>
                  </MenuList>
                </Menu>
              </CircleAndMemberFilters>
            }
            actions={
              isMember && (
                <IconTextButton
                  aria-label={t('ThreadsPage.create')}
                  showText="wide"
                  size={pageHeaderButtonSize}
                  colorScheme="blue"
                  icon={<AddIcon size={20} />}
                  onClick={onCreateOpen}
                />
              )
            }
          />
        }
      >
        <Box
          maxW="3xl"
          my={threadId ? 4 : 10}
          px={threadId ? 4 : { base: 5, sm: 10 }}
        >
          {loading && <Loading active center />}
          <TextErrors errors={[error]} />

          {filteredThreads && (
            <ThreadsList
              threads={filteredThreads}
              showIcon
              showCircle
              showMember
            />
          )}

          {isMember && !loading && (
            <Button variant="outline" size="sm" mt={3} onClick={onCreateOpen}>
              {t('ThreadsPage.add')}
            </Button>
          )}

          {!loading && threads?.length === 0 && (
            <OnboardingVideo
              type={OnboardingVideoType.ThreadsAndTasks}
              mt={10}
            />
          )}
        </Box>
      </ScrollableLayout>

      {isCreateOpen && <ThreadEditModal isOpen onClose={onCreateClose} />}
    </>
  )

  // List and selected thread side by side. Same structure with or without a
  // selected thread, so that the list is not remounted when one is opened
  return (
    <Flex h={`calc(100dvh - ${sidebarContext?.height || 0}px)`}>
      <Box w={threadId ? '420px' : '100%'} flexShrink={0} h="100%">
        {list}
      </Box>
      {threadId && (
        <Box flex={1} minW={0} h="100%">
          <Outlet />
        </Box>
      )}
    </Flex>
  )
}
