import useNow from '@/common/hooks/useNow'
import useCurrentMember from '@/member/hooks/useCurrentMember'
import useOrgMember from '@/member/hooks/useOrgMember'
import { useNavigateOrg } from '@/org/hooks/useNavigateOrg'
import { usePathInOrg } from '@/org/hooks/usePathInOrg'
import TaskDueDate from '@/task/components/TaskDueDate'
import TaskItem from '@/task/components/TaskItem'
import { useTasks } from '@/task/hooks/useTasks'
import { isTaskOverdue } from '@/task/utils/isTaskOverdue'
import TaskModal from '@/task/modals/TaskModal'
import { useDisclosure } from '@chakra-ui/react'
import { TasksSortTypes, TasksViewTypes } from '@rolebase/shared/model/task'
import React, { useContext, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { TasksIcon } from 'src/icons'
import { SidebarContext } from '../contexts/SidebarContext'
import { sidebarSubItemProps } from './SidebarItem'
import SidebarItemLink from './SidebarItemLink'
import SidebarItemsContainer from './SidebarItemsContainer'
import SidebarSeeAllLink from './SidebarSeeAllLink'

const maxTasks = 5

// Tasks link, with my most urgent tasks below
export default function SidebarTasks() {
  const { t } = useTranslation()
  const sidebarContext = useContext(SidebarContext)
  const compact = !!sidebarContext?.compact
  const member = useCurrentMember()
  const isMember = useOrgMember()
  const navigate = useNavigateOrg()
  const tasksPath = usePathInOrg('tasks')
  const listPath = `${tasksPath}?member=${member?.id || ''}`
  const createModal = useDisclosure()

  // Nearest due date first, then manual order
  const { tasks } = useTasks(
    TasksViewTypes.List,
    { memberId: member?.id },
    TasksSortTypes.DueDate
  )

  const now = useNow()
  const hasOverdue = useMemo(
    () => tasks.some((task) => isTaskOverdue(task, now)),
    [tasks, now]
  )

  return (
    <>
      <SidebarItemLink
        to={listPath}
        activePath={tasksPath}
        icon={TasksIcon}
        alert={hasOverdue}
        compact={compact}
        onAdd={isMember ? createModal.onOpen : undefined}
      >
        {t('Sidebar.tasks')}
      </SidebarItemLink>

      {!compact && tasks.length > 0 && (
        <SidebarItemsContainer>
          {tasks.slice(0, maxTasks).map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              noModal
              mb={0}
              {...sidebarSubItemProps}
            >
              {task.dueDate && (
                <TaskDueDate dueDate={task.dueDate} status={task.status} />
              )}
            </TaskItem>
          ))}
          {tasks.length > maxTasks && (
            <SidebarSeeAllLink to={listPath}>
              {t('Sidebar.seeAllTasks', { count: tasks.length })}
            </SidebarSeeAllLink>
          )}
        </SidebarItemsContainer>
      )}

      {createModal.isOpen && (
        <TaskModal
          isOpen
          onCreate={(taskId) => navigate(`tasks/${taskId}`)}
          onClose={createModal.onClose}
        />
      )}
    </>
  )
}
