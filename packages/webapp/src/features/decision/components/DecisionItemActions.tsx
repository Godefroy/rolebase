import ItemActionsMenu from '@/common/atoms/actionsMenu/ItemActionsMenu'
import { DecisionFragment } from '@gql'
import React from 'react'
import useDecisionActions from '../hooks/useDecisionActions'

interface Props {
  decision: DecisionFragment
}

// "..." menu of a decision card, same actions as the decision view
export default function DecisionItemActions({ decision }: Props) {
  const { hasItems, items, modals } = useDecisionActions(decision)
  return (
    <>
      {hasItems && <ItemActionsMenu>{items}</ItemActionsMenu>}
      {modals}
    </>
  )
}
