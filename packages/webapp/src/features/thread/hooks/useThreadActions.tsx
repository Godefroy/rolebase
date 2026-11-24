import CopyLinkMenuItem from '@/common/atoms/actionsMenu/CopyLinkMenuItem'
import DeleteMenuItem from '@/common/atoms/actionsMenu/DeleteMenuItem'
import EditMenuItem from '@/common/atoms/actionsMenu/EditMenuItem'
import UnarchiveMenuItem from '@/common/atoms/actionsMenu/UnarchiveMenuItem'
import { usePathInOrg } from '@/org/hooks/usePathInOrg'
import { ThreadFragment, useUpdateThreadMutation } from '@gql'
import React, { ReactNode, useState } from 'react'
import settings from 'src/settings'
import ThreadEditModal from '../modals/ThreadEditModal'
import useThreadPermissions from './useThreadPermissions'

export interface ThreadActions {
  hasItems: boolean
  // Menu items, rendered in an ActionsMenu (content view) or ItemActionsMenu (card)
  items: ReactNode
  // Modals opened by the items, to render next to the menu
  modals: ReactNode
  openEdit(): void
}

// Actions on a thread, shared by the thread view header and the thread cards
export default function useThreadActions(
  thread: ThreadFragment | undefined
): ThreadActions {
  const { canEdit } = useThreadPermissions(thread)
  const path = usePathInOrg(`threads/${thread?.id}`)
  const [updateThread] = useUpdateThreadMutation()
  const [modal, setModal] = useState<'edit' | undefined>()
  const handleModalClose = () => setModal(undefined)

  // Archive / unarchive
  const setArchived = (archived: boolean) => {
    if (!thread) return
    updateThread({
      variables: {
        id: thread.id,
        values: { archivedAt: archived ? new Date().toISOString() : null },
      },
    })
  }

  const hasItems = !!thread && canEdit

  return {
    hasItems,
    items: hasItems && (
      <>
        <EditMenuItem onClick={() => setModal('edit')} />
        <CopyLinkMenuItem url={`${settings.url}${path}`} />
        {thread.archivedAt ? (
          <UnarchiveMenuItem onClick={() => setArchived(false)} />
        ) : (
          <DeleteMenuItem onClick={() => setArchived(true)} />
        )}
      </>
    ),
    modals: modal === 'edit' && thread && (
      <ThreadEditModal isOpen thread={thread} onClose={handleModalClose} />
    ),
    openEdit: () => setModal('edit'),
  }
}
