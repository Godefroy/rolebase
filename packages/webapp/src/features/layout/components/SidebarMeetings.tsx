import MeetingsList from '@/meeting/components/MeetingsList'
import useCurrentMember from '@/member/hooks/useCurrentMember'
import { useOrgContext } from '@/org/contexts/OrgContext'
import { useNextMeetingsSubscription } from '@gql'
import React from 'react'
import { sidebarSubItemProps } from './SidebarItem'
import SidebarItemsContainer from './SidebarItemsContainer'

interface Props {
  max: number
}

export default function SidebarMeetings({ max }: Props) {
  const { orgId } = useOrgContext()
  const currentMember = useCurrentMember()

  const { data, loading } = useNextMeetingsSubscription({
    skip: !orgId || !currentMember,
    variables: {
      orgId: orgId!,
      memberId: currentMember?.id!,
    },
  })
  const meetings = data?.meeting

  // Don't show card if empty or loading
  const hasItems = !!(orgId && currentMember && !loading && meetings?.length)

  return (
    <SidebarItemsContainer hasItems={hasItems}>
      {meetings && (
        <MeetingsList
          meetings={meetings.slice(0, max)}
          showCircle
          noModal
          itemProps={sidebarSubItemProps}
          dayLabelProps={{
            pl: sidebarSubItemProps.pl,
          }}
        />
      )}
    </SidebarItemsContainer>
  )
}
