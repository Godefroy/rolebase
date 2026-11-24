import ScrollableLayout from '@/common/atoms/ScrollableLayout'
import { Title } from '@/common/atoms/Title'
import useUpdatableQueryParams from '@/common/hooks/useUpdatableQueryParams'
import { Box } from '@chakra-ui/react'
import { Task_Status_Enum } from '@gql'
import { TasksSortTypes, TasksViewTypes } from '@rolebase/shared/model/task'
import React from 'react'
import { useTranslation } from 'react-i18next'
import TasksContent from '../components/TasksContent'
import TasksHeader from '../components/TasksHeader'
import { TasksModuleProvider } from '../contexts/TasksModuleContext'

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

  // View param
  const view =
    (params.view && TasksViewTypes[params.view]) || TasksViewTypes.Kanban
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
      <ScrollableLayout
        beigeContent
        header={
          <TasksHeader showCreateBtn title={t('TasksPage.heading')} ml={5} />
        }
      >
        <Title>{t('TasksPage.heading')}</Title>

        <Box h="100%" px={7} py={10} overflowX="auto">
          <TasksContent isFullPage />
        </Box>
      </ScrollableLayout>
    </TasksModuleProvider>
  )
}
