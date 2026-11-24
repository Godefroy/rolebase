import DeleteMenuItem from '@/common/atoms/actionsMenu/DeleteMenuItem'
import EditMenuItem from '@/common/atoms/actionsMenu/EditMenuItem'
import useOrgMember from '@/member/hooks/useOrgMember'
import { DecisionFragment } from '@gql'
import React, { ReactNode, useState } from 'react'
import DecisionDeleteModal from '../modals/DecisionDeleteModal '
import DecisionEditModal from '../modals/DecisionEditModal'
import useCanEditDecisions from './useCanEditDecisions'

interface Options {
  // The decision was deleted
  onDelete?(): void
}

export interface DecisionActions {
  hasItems: boolean
  // Menu items, rendered in an ActionsMenu (content view) or ItemActionsMenu (card)
  items: ReactNode
  // Modals opened by the items, to render next to the menu
  modals: ReactNode
}

// Actions on a decision, shared by the decision view header and the decision cards
export default function useDecisionActions(
  decision: DecisionFragment | undefined,
  { onDelete }: Options = {}
): DecisionActions {
  const isMember = useOrgMember()
  const canEdit = useCanEditDecisions(decision?.circleId)
  const [modal, setModal] = useState<'edit' | 'delete' | undefined>()
  const handleModalClose = () => setModal(undefined)

  const hasItems = !!decision && isMember && canEdit

  return {
    hasItems,
    items: hasItems && (
      <>
        <EditMenuItem onClick={() => setModal('edit')} />
        <DeleteMenuItem onClick={() => setModal('delete')} />
      </>
    ),
    modals: decision && (
      <>
        {modal === 'edit' && (
          <DecisionEditModal
            decision={decision}
            isOpen
            onClose={handleModalClose}
          />
        )}
        {modal === 'delete' && (
          <DecisionDeleteModal
            decision={decision}
            isOpen
            onClose={handleModalClose}
            onDelete={onDelete}
          />
        )}
      </>
    ),
  }
}
