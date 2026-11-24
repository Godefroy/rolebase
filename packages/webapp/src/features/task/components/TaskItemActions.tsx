import ItemActionsMenu from '@/common/atoms/actionsMenu/ItemActionsMenu'
import { TaskFragment } from '@gql'
import React from 'react'
import useTaskActions from '../hooks/useTaskActions'

interface Props {
  task: TaskFragment
}

// "..." menu of a task card, same actions as the task view
export default function TaskItemActions({ task }: Props) {
  const { hasItems, items, modals } = useTaskActions(task)
  return (
    <>
      {hasItems && <ItemActionsMenu>{items}</ItemActionsMenu>}
      {modals}
    </>
  )
}
