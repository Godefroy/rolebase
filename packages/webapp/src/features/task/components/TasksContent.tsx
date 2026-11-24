import Loading from '@/common/atoms/Loading'
import OverflowContainer, {
  OverflowContainerParams,
} from '@/common/atoms/OverflowContainer'
import TextErrors from '@/common/atoms/TextErrors'
import useOrgAdmin from '@/member/hooks/useOrgAdmin'
import useOrgMember from '@/member/hooks/useOrgMember'
import OnboardingVideo, {
  OnboardingVideoType,
} from '@/onboarding/components/OnboardingVideo'
import { Box } from '@chakra-ui/react'
import { TasksSortTypes, TasksViewTypes } from '@rolebase/shared/model/task'
import React, { useContext } from 'react'
import { TasksModuleContext } from '../contexts/TasksModuleContext'
import TasksKanban from './TasksKanban'
import TasksList from './TasksList'

interface Props {
  overflowContainer?: OverflowContainerParams
  isFullPage?: boolean
}

export default function TasksContent({ overflowContainer, isFullPage }: Props) {
  const isMember = useOrgMember()
  const isAdmin = useOrgAdmin()

  const {
    view,
    circleId,
    memberId,
    sort,
    tasks: tasksResult,
  } = useContext(TasksModuleContext)
  if (!tasksResult) return null
  const { tasks, loading, error, changeOrder } = tasksResult
  const isSorted = !!sort && sort !== TasksSortTypes.Manual

  return (
    <>
      {view === TasksViewTypes.Kanban && (
        <OverflowContainer {...overflowContainer}>
          <TasksKanban
            tasks={tasks}
            onOrderChange={isMember && !isSorted ? changeOrder : undefined}
            showMember={!memberId}
            showCircle={!circleId}
          />

          {isAdmin && tasks.length === 0 && isFullPage && (
            <OnboardingVideo
              type={OnboardingVideoType.ThreadsAndTasks}
              mt={10}
              maxW="3xl"
              mx="auto"
            />
          )}
        </OverflowContainer>
      )}

      {!loading && view === TasksViewTypes.List && (
        <Box maxW="3xl" px={{ base: 0, sm: 3 }}>
          <TasksList
            tasks={tasks}
            onOrderChange={isMember && !isSorted ? changeOrder : undefined}
            showMember={!memberId}
            showCircle={!circleId}
            showDueDate
            showCreateBtn
          />

          {isAdmin && tasks.length === 0 && isFullPage && (
            <OnboardingVideo
              type={OnboardingVideoType.ThreadsAndTasks}
              mt={10}
            />
          )}
        </Box>
      )}

      {loading && <Loading active size="md" />}
      <TextErrors errors={[error]} />
    </>
  )
}
