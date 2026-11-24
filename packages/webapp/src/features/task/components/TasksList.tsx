import useOrgMember from '@/member/hooks/useOrgMember'
import { Box, Button, HTMLChakraProps, Text } from '@chakra-ui/react'
import { TaskFragment } from '@gql'
import {
  DragDropContext,
  Draggable,
  DropResult,
  Droppable,
} from '@hello-pangea/dnd'
import React, { useCallback, useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { TasksModuleContext } from '../contexts/TasksModuleContext'
import TaskItem from './TaskItem'

interface Props {
  tasks: TaskFragment[]
  noModal?: boolean
  showCircle?: boolean
  showMember?: boolean
  showDueDate?: boolean
  showCreateBtn?: boolean
  itemProps?: HTMLChakraProps<any>
  onOrderChange?(tasksIds: string[]): void
}

export default function TasksList({
  tasks,
  noModal,
  showCircle,
  showMember,
  showDueDate,
  showCreateBtn,
  itemProps,
  onOrderChange,
}: Props) {
  const { t } = useTranslation()
  const isMember = useOrgMember()

  const { openCreateTask } = useContext(TasksModuleContext)

  // Move a task
  const handleDragEnd = useCallback(
    (result: DropResult) => {
      const taskId = result.draggableId
      const index = result.destination?.index
      const task = tasks.find((t) => t.id === taskId)
      if (!task || index === undefined) return

      const tasksIds = tasks.map((task) => task.id)
      // Remove taskId from previous position
      const prevIndex = tasksIds.indexOf(taskId)
      if (prevIndex !== -1) {
        tasksIds.splice(prevIndex, 1)
      }
      // Add taskId to new position
      tasksIds.splice(index, 0, taskId)

      onOrderChange?.(tasksIds)
    },
    [tasks, onOrderChange]
  )

  return (
    <DragDropContext
      key={!onOrderChange ? 0 : 1}
      enableDefaultSensors={!!onOrderChange}
      onDragEnd={handleDragEnd}
    >
      {tasks.length === 0 && (
        <Text fontStyle="italic">{t('TasksList.empty')}</Text>
      )}

      <Droppable droppableId="TasksList">
        {(provided) => (
          <Box ref={provided.innerRef} {...provided.droppableProps}>
            {tasks.map((task, index) => (
              <Draggable
                key={task.id}
                draggableId={task.id}
                index={index}
                isDragDisabled={!onOrderChange}
              >
                {(provided, snapshot) => (
                  <TaskItem
                    key={task.id}
                    ref={provided.innerRef}
                    task={task}
                    noModal={noModal}
                    showCircle={showCircle}
                    showMember={showMember}
                    showDueDate={showDueDate}
                    isDragging={snapshot.isDragging}
                    {...itemProps}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  />
                )}
              </Draggable>
            ))}

            {provided.placeholder}
          </Box>
        )}
      </Droppable>

      {showCreateBtn && openCreateTask && isMember && (
        <Button
          variant="outline"
          size="sm"
          mt={3}
          onClick={() => openCreateTask()}
        >
          {t('TasksKanban.createTask')}
        </Button>
      )}
    </DragDropContext>
  )
}
