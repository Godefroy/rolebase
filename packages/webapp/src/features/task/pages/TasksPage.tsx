import useHasRoomForColumns from '@/layout/hooks/useHasRoomForColumns'
import ScrollableLayout from '@/common/atoms/ScrollableLayout'
import useOverflowHidden from '@/common/hooks/useOverflowHidden'
import { Title } from '@/common/atoms/Title'
import useUpdatableQueryParams from '@/common/hooks/useUpdatableQueryParams'
import { SidebarContext } from '@/layout/contexts/SidebarContext'
import { Box, Flex } from '@chakra-ui/react'
import { Task_Status_Enum } from '@gql'
import { TasksSortTypes, TasksViewTypes } from '@rolebase/shared/model/task'
import React, { useContext } from 'react'
import { Outlet, useParams } from 'react-router'
import { useTranslation } from 'react-i18next'
import TasksContent from '../components/TasksContent'
import TasksHeader from '../components/TasksHeader'
import { TasksModuleProvider } from '../contexts/TasksModuleContext'

// Room needed for the tasks and a task side by side
export const tasksColumnsMinWidth = 1030

type Params = {
  view: TasksViewTypes
  member: string
  circle: string
  status: Task_Status_Enum
  sort: TasksSortTypes
}

export default function TasksPage() {
  const { t } = useTranslation()
  const { params, changeParams } = useUpdatableQueryParams<Params>()
  const sidebarContext = useContext(SidebarContext)

  // Selected task: next to the tasks on desktop, in their place on mobile
  const { taskId } = useParams<{ taskId: string }>()
  const hasColumns = useHasRoomForColumns(tasksColumnsMinWidth)
  useOverflowHidden()

  // View param, list by default on mobile
  const view =
    (params.view && TasksViewTypes[params.view]) ||
    (sidebarContext?.isMobile ? TasksViewTypes.List : TasksViewTypes.Kanban)
  const handleViewChange = (view: TasksViewTypes) =>
    changeParams({ view: TasksViewTypes[view] as any })

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

  // Status param
  const status = params.status && Task_Status_Enum[params.status]
  const handleStatusChange = (status: Task_Status_Enum | undefined) =>
    changeParams({ status })

  // Sort param
  const sort =
    (params.sort && TasksSortTypes[params.sort]) || TasksSortTypes.Manual
  const handleSortChange = (sort: TasksSortTypes) =>
    changeParams({ sort: sort === TasksSortTypes.Manual ? undefined : sort })

  // Mobile: the selected task replaces the tasks
  if (taskId && !hasColumns) return <Outlet />

  const tasks = (
    <ScrollableLayout
      beigeContent
      header={
        <TasksHeader showCreateBtn title={t('TasksPage.heading')} ml={5} />
      }
    >
      {!taskId && <Title>{t('TasksPage.heading')}</Title>}

      <Box h="100%" px={7} py={10} overflowX="auto">
        <TasksContent isFullPage />
      </Box>
    </ScrollableLayout>
  )

  return (
    <TasksModuleProvider
      view={view}
      circleId={circleId}
      memberId={memberId}
      status={status}
      sort={sort}
      onViewChange={handleViewChange}
      onCircleChange={handleCircleChange}
      onMemberChange={handleMemberChange}
      onStatusChange={handleStatusChange}
      onSortChange={handleSortChange}
    >
      {/* Same structure with or without a selected task, so that the
          tasks are not remounted when one is opened */}
      <Flex h={`calc(100dvh - ${sidebarContext?.height || 0}px)`}>
        <Box flex={1} minW={0} h="100%">
          {tasks}
        </Box>
        {taskId && (
          <Box
            w="480px"
            flexShrink={0}
            h="100%"
            overflowY="auto"
            bg="white"
            _dark={{ bg: 'gray.900' }}
          >
            <Outlet />
          </Box>
        )}
      </Flex>
    </TasksModuleProvider>
  )
}
