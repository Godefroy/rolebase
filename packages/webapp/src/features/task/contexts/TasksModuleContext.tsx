import useCurrentMember from '@/member/hooks/useCurrentMember'
import { usePathInOrg } from '@/org/hooks/usePathInOrg'
import { useDisclosure } from '@chakra-ui/react'
import { Task_Status_Enum, TaskFragment } from '@gql'
import { TasksSortTypes, TasksViewTypes } from '@rolebase/shared/model/task'
import React, {
  createContext,
  ReactNode,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { useLocation, useNavigate } from 'react-router'
import { useTasks } from '../hooks/useTasks'
import TaskModal from '../modals/TaskModal'

export interface TasksModuleContextParams {
  view: TasksViewTypes
  circleId?: string
  memberId?: string
  status?: Task_Status_Enum
  sort?: TasksSortTypes
  onViewChange?: (view: TasksViewTypes) => void
  onCircleChange?: (circleId: string | undefined) => void
  onMemberChange?: (memberId: string | undefined) => void
  onStatusChange?: (status: Task_Status_Enum | undefined) => void
  onSortChange?: (sort: TasksSortTypes) => void
}

export interface TasksModuleContextValue extends TasksModuleContextParams {
  tasks?: ReturnType<typeof useTasks>
  openCreateTask?: (defaults?: Partial<TaskFragment>) => void
}

export const TasksModuleContext = createContext<TasksModuleContextValue>({
  view: TasksViewTypes.Kanban,
})

interface TasksModuleProviderProps extends TasksModuleContextParams {
  children: ReactNode
}

export function TasksModuleProvider({
  children,
  ...params
}: TasksModuleProviderProps) {
  const modal = useDisclosure()
  const currentMember = useCurrentMember()

  const [defaults, setDefaults] = useState<Partial<TaskFragment>>({})

  // Sort from params, or local state when params don't handle it
  const [localSort, setLocalSort] = useState(TasksSortTypes.Manual)
  const sort = params.onSortChange
    ? (params.sort ?? TasksSortTypes.Manual)
    : localSort
  const onSortChange = params.onSortChange ?? setLocalSort

  // Subscribe to tasks
  const tasks = useTasks(
    params.view,
    {
      memberId: params.memberId,
      circleId: params.circleId,
      status: params.status,
    },
    sort
  )

  useEffect(() => {
    setDefaults({
      memberId: params.memberId || currentMember?.id,
      circleId: params.circleId,
      status: params.status,
    })
  }, [params.memberId, params.circleId, params.status])

  const value: TasksModuleContextValue = useMemo(
    () => ({
      ...params,
      sort,
      onSortChange,
      tasks,
      openCreateTask: (defaults) => {
        if (defaults) {
          setDefaults((d) => ({ ...d, ...defaults }))
        }
        modal.onOpen()
      },
    }),
    [
      tasks,
      sort,
      onSortChange,
      params.view,
      params.circleId,
      params.memberId,
      params.status,
      params.onViewChange,
      params.onCircleChange,
      params.onMemberChange,
      params.onStatusChange,
    ]
  )

  // On the tasks page, open the created task next to the tasks
  const location = useLocation()
  const navigate = useNavigate()
  const tasksPath = usePathInOrg('tasks')
  const handleCreate = (taskId: string) => {
    if (location.pathname.startsWith(tasksPath)) {
      navigate(`${tasksPath}/${taskId}${location.search}`)
    }
  }

  return (
    <TasksModuleContext.Provider value={value}>
      {children}

      {modal.isOpen && (
        <TaskModal
          isOpen
          defaults={defaults}
          onCreate={handleCreate}
          onClose={modal.onClose}
        />
      )}
    </TasksModuleContext.Provider>
  )
}
