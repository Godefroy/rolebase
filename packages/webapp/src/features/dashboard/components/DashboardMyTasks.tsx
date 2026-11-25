import TextErrors from '@/common/atoms/TextErrors'
import DashboardMyInfosItem from '@/dashboard/components/DashboardMyInfosItem'
import useCurrentMember from '@/member/hooks/useCurrentMember'
import useOrgMember from '@/member/hooks/useOrgMember'
import { useNavigateOrg } from '@/org/hooks/useNavigateOrg'
import TasksList from '@/task/components/TasksList'
import { useTasks } from '@/task/hooks/useTasks'
import TaskModal from '@/task/modals/TaskModal'
import { Button, useDisclosure } from '@chakra-ui/react'
import { TasksViewTypes } from '@rolebase/shared/model/task'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { CreateIcon } from 'src/icons'

export default function DashboardMyTasks() {
  const { t } = useTranslation()
  const member = useCurrentMember()
  const isMember = useOrgMember()
  const navigate = useNavigateOrg()

  const { tasks, error, loading, changeOrder } = useTasks(TasksViewTypes.List, {
    memberId: member?.id,
  })

  const createModal = useDisclosure()

  // Don't show card if empty or loading
  if (tasks?.length === 0 || loading) return null

  return (
    <DashboardMyInfosItem
      title={t('DashboardMyTasks.title')}
      path={`tasks?member=${member?.id}`}
      actions={
        isMember && (
          <Button
            size="sm"
            colorScheme="blue"
            leftIcon={<CreateIcon size={20} />}
            onClick={createModal.onOpen}
          >
            {t('DashboardMyTasks.add')}
          </Button>
        )
      }
    >
      <TextErrors errors={[error]} />

      <TasksList
        tasks={tasks}
        onOrderChange={changeOrder}
        showCircle
        showDueDate
      />

      {createModal.isOpen && (
        <TaskModal
          isOpen
          defaults={{ memberId: member?.id }}
          onCreate={(taskId) => navigate(`tasks/${taskId}`)}
          onClose={createModal.onClose}
        />
      )}
    </DashboardMyInfosItem>
  )
}
