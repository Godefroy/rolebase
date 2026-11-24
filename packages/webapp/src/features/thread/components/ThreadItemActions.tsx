import ItemActionsMenu from '@/common/atoms/actionsMenu/ItemActionsMenu'
import { ThreadFragment } from '@gql'
import React from 'react'
import useThreadActions from '../hooks/useThreadActions'

interface Props {
  thread: ThreadFragment
}

// "..." menu of a thread card, same actions as the thread view
export default function ThreadItemActions({ thread }: Props) {
  const { hasItems, items, modals } = useThreadActions(thread)
  return (
    <>
      {hasItems && <ItemActionsMenu>{items}</ItemActionsMenu>}
      {modals}
    </>
  )
}
