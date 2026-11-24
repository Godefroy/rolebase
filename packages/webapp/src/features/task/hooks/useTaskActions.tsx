import CopyLinkMenuItem from '@/common/atoms/actionsMenu/CopyLinkMenuItem'
import DeleteMenuItem from '@/common/atoms/actionsMenu/DeleteMenuItem'
import useOrgMember from '@/member/hooks/useOrgMember'
import { usePathInOrg } from '@/org/hooks/usePathInOrg'
import { TaskFragment } from '@gql'
import React, { ReactNode, useState } from 'react'
import settings from 'src/settings'
import TaskDeleteModal from '../modals/TaskDeleteModal'

interface Options {
  // The task was deleted
  onDelete?(): void
}

export interface TaskActions {
  hasItems: boolean
  // Menu items, rendered in an ActionsMenu (content view) or ItemActionsMenu (card)
  items: ReactNode
  // Modals opened by the items, to render next to the menu
  modals: ReactNode
}

// Actions on a task, shared by the task view header and the task cards
export default function useTaskActions(
  task: TaskFragment | undefined,
  { onDelete }: Options = {}
): TaskActions {
  const isMember = useOrgMember()
  const path = usePathInOrg(`tasks/${task?.id}`)
  const [modal, setModal] = useState<'delete' | undefined>()
  const handleModalClose = () => setModal(undefined)

  const hasItems = !!task && isMember

  return {
    hasItems,
    items: hasItems && (
      <>
        <CopyLinkMenuItem url={`${settings.url}${path}`} />
        <DeleteMenuItem onClick={() => setModal('delete')} />
      </>
    ),
    modals: modal === 'delete' && task && (
      <TaskDeleteModal
        task={task}
        isOpen
        onClose={handleModalClose}
        onDelete={onDelete}
      />
    ),
  }
}
