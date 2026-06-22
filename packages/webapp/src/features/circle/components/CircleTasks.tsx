import Loading from '@/common/atoms/Loading'
import TextErrors from '@/common/atoms/TextErrors'
import useOrgMember from '@/member/hooks/useOrgMember'
import { useNavigateOrg } from '@/org/hooks/useNavigateOrg'
import { useTasks } from '@/task/hooks/useTasks'
import TaskModal from '@/task/modals/TaskModal'
import { Button, Flex, Spacer, useDisclosure } from '@chakra-ui/react'
import { TasksViewTypes } from '@rolebase/shared/model/task'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { CreateIcon, KanbanIcon } from 'src/icons'
import TasksList from '../../task/components/TasksList'
import useOrgAdmin from '@/member/hooks/useOrgAdmin'
import OnboardingVideo, {
  OnboardingVideoType,
} from '@/onboarding/components/OnboardingVideo'

interface Props {
  circleId: string
}

export default function CircleTasks({ circleId }: Props) {
  const { t } = useTranslation()
  const isMember = useOrgMember()
  const isAdmin = useOrgAdmin()
  const navigateOrg = useNavigateOrg()

  // Subscribe to tasks
  const { tasks, error, loading, changeOrder } = useTasks(TasksViewTypes.List, {
    circleId,
  })

  // Task create modal
  const {
    isOpen: isCreateOpen,
    onOpen: onCreateOpen,
    onClose: onCreateClose,
  } = useDisclosure()

  return (
    <>
      <Flex mb={4}>
        {isMember && (
          <Button
            size="sm"
            colorScheme="blue"
            leftIcon={<CreateIcon size={20} />}
            onClick={onCreateOpen}
          >
            {t('CircleTasks.create')}
          </Button>
        )}

        <Spacer />
        <Button
          size="sm"
          variant="outline"
          leftIcon={<KanbanIcon size={18} />}
          onClick={() => navigateOrg(`tasks?circle=${circleId}&view=Kanban`)}
        >
          Kanban
        </Button>
      </Flex>

      {loading && <Loading active size="md" />}
      <TextErrors errors={[error]} />

      <TasksList
        tasks={tasks}
        onOrderChange={isMember ? changeOrder : undefined}
        showMember
        showDueDate
      />

      {isAdmin && tasks.length === 0 && (
        <OnboardingVideo type={OnboardingVideoType.ThreadsAndTasks} mt={10} />
      )}

      {isCreateOpen && (
        <TaskModal defaults={{ circleId }} isOpen onClose={onCreateClose} />
      )}
    </>
  )
}
