import { HStack } from '@chakra-ui/react'
import { TaskFragment, Task_Status_Enum } from '@gql'
import { DragDropContext, DropResult } from '@hello-pangea/dnd'
import { taskStatusList } from '@rolebase/shared/model/task'
import React, { useCallback } from 'react'
import useUpdateTaskStatus from '../hooks/useUpdateTaskStatus'
import TasksKanbanColumn from './TasksKanbanColumn'

interface Props {
  tasks: TaskFragment[]
  showCircle?: boolean
  showMember?: boolean
  onOrderChange?(tasksIds: string[], changedTask: TaskFragment): void
}

export default function TasksKanban({
  tasks,
  onOrderChange,
  showCircle,
  showMember,
}: Props) {
  const updateTaskStatus = useUpdateTaskStatus()

  // Move a task
  const handleDragEnd = useCallback(
    (result: DropResult) => {
      const taskId = result.draggableId
      const status = result.destination?.droppableId as
        Task_Status_Enum | undefined
      const indexInStatus = result.destination?.index
      const task = tasks.find((t) => t.id === taskId)
      if (!task || !status || indexInStatus === undefined) return

      // Change status
      if (status !== task.status) {
        updateTaskStatus(task, status)
      }

      const tasksIds = taskStatusList.flatMap((s) => {
        const ids = tasks.filter((t) => t.status === s).map((task) => task.id)
        // Remove taskId from previous position
        const index = ids.indexOf(taskId)
        if (index !== -1) {
          ids.splice(index, 1)
        }
        // Add taskId to new position
        if (s === status) {
          ids.splice(indexInStatus, 0, taskId)
        }
        return ids
      })

      onOrderChange?.(tasksIds, { ...task, status })
    },
    [tasks, onOrderChange, updateTaskStatus]
  )

  return (
    <DragDropContext
      key={!onOrderChange ? 0 : 1}
      enableDefaultSensors={!!onOrderChange}
      onDragEnd={handleDragEnd}
    >
      <HStack align="start" pb={5} justifyContent="center" minW="min-content">
        {taskStatusList.map((status) => (
          <TasksKanbanColumn
            key={status}
            status={status}
            tasks={tasks}
            showCircle={showCircle}
            showMember={showMember}
          />
        ))}
      </HStack>
    </DragDropContext>
  )
}
