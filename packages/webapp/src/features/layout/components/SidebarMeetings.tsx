import useDateLocale from '@/common/hooks/useDateLocale'
import useNow from '@/common/hooks/useNow'
import MeetingItem from '@/meeting/components/MeetingItem'
import MeetingEditModal from '@/meeting/modals/MeetingEditModal'
import useCurrentMember from '@/member/hooks/useCurrentMember'
import useOrgMember from '@/member/hooks/useOrgMember'
import { useOrgContext } from '@/org/contexts/OrgContext'
import { usePathInOrg } from '@/org/hooks/usePathInOrg'
import { Text, useDisclosure } from '@chakra-ui/react'
import { useNextMeetingsSubscription } from '@gql'
import { useStoreState } from '@store/hooks'
import { format, isToday } from 'date-fns'
import React, { useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { MeetingsIcon } from 'src/icons'
import { SidebarContext } from '../contexts/SidebarContext'
import SidebarItemLink from './SidebarItemLink'
import SidebarItemsContainer from './SidebarItemsContainer'

// Meetings link, with my next meeting below
export default function SidebarMeetings() {
  const { t } = useTranslation()
  const dateLocale = useDateLocale()
  const sidebarContext = useContext(SidebarContext)
  const compact = !!sidebarContext?.compact
  const { orgId } = useOrgContext()
  const currentMember = useCurrentMember()
  const isMember = useOrgMember()
  const meetingsPath = usePathInOrg('meetings')
  const currentMeetingId = useStoreState(
    (state) => state.memberStatus.currentMeetingId
  )
  const createModal = useDisclosure()
  const now = useNow()

  const { data } = useNextMeetingsSubscription({
    skip: !orgId || !currentMember,
    variables: {
      orgId: orgId!,
      memberId: currentMember?.id!,
    },
  })
  const [nextMeeting, followingMeeting] = data?.meeting ?? []
  const isLive =
    !!nextMeeting &&
    ((!!nextMeeting.currentStepId && !nextMeeting.ended) ||
      new Date(nextMeeting.startDate) <= now)

  return (
    <>
      <SidebarItemLink
        to={`${meetingsPath}?member=${currentMember?.id || ''}`}
        activePath={meetingsPath}
        icon={MeetingsIcon}
        alert={!!currentMeetingId || isLive}
        compact={compact}
        onAdd={isMember ? createModal.onOpen : undefined}
      >
        {t('Sidebar.meetings')}
      </SidebarItemLink>

      {!compact && nextMeeting && (
        <SidebarItemsContainer>
          <MeetingItem
            meeting={nextMeeting}
            card
            showDay
            showTime
            showCircle
            hideActions
            noModal
            mb={0}
          />
          {followingMeeting &&
            isToday(new Date(followingMeeting.startDate)) && (
              <Text
                mt={1.5}
                px={1}
                fontSize="xs"
                color="gray.500"
                noOfLines={1}
                _dark={{ color: 'whiteAlpha.600' }}
              >
                {t('Sidebar.nextMeeting', {
                  title: followingMeeting.title,
                  time: format(new Date(followingMeeting.startDate), 'p', {
                    locale: dateLocale,
                  }),
                })}
              </Text>
            )}
        </SidebarItemsContainer>
      )}

      {createModal.isOpen && (
        <MeetingEditModal isOpen onClose={createModal.onClose} />
      )}
    </>
  )
}
