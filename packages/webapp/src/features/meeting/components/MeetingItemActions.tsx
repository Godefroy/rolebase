import ItemActionsMenu from '@/common/atoms/actionsMenu/ItemActionsMenu'
import { Center, Spinner } from '@chakra-ui/react'
import { useMeetingSubscription } from '@gql'
import React, { useState } from 'react'
import useMeetingActions from '../hooks/useMeetingActions'

interface Props {
  meetingId: string
}

// "..." menu of a meeting card, same actions as the meeting view (without
// the session controls). Lists only load meeting summaries: the full meeting,
// needed for permissions and edition, loads when the menu first opens.
export default function MeetingItemActions({ meetingId }: Props) {
  const [isActive, setIsActive] = useState(false)
  const { data } = useMeetingSubscription({
    skip: !isActive,
    variables: { id: meetingId },
  })
  const { items, modals } = useMeetingActions(data?.meeting_by_pk || undefined)

  return (
    <>
      <ItemActionsMenu onOpen={() => setIsActive(true)}>
        {items || (
          <Center py={2}>
            <Spinner size="sm" />
          </Center>
        )}
      </ItemActionsMenu>
      {modals}
    </>
  )
}
