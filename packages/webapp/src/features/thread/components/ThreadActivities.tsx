import { MeetingContext } from '@/meeting/contexts/MeetingContext'
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Box,
  StyleProps,
  VStack,
  forwardRef,
} from '@chakra-ui/react'
import { Thread_Activity_Type_Enum } from '@gql'
import { ThreadActivityMeetingNoteFragment } from '@rolebase/shared/model/thread_activity'
import useCurrentMember from '@/member/hooks/useCurrentMember'
import { ScrollableContext } from '@/common/hooks/useScrollable'
import { isSameDay } from 'date-fns'
import React, {
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { useTranslation } from 'react-i18next'
import { ThreadIcon } from 'src/icons'
import ProposalScrollButton from '@/proposal/components/ProposalScrollButton'
import { useLocation } from 'react-router'
import { ThreadContext } from '../contexts/ThreadContext'
import {
  getActivityIdFromHash,
  scrollAndHighlightActivity,
} from '../utils/scrollAndHighlightActivity'
import ThreadActivity from './ThreadActivity'
import ThreadDaySeparator from './ThreadDaySeparator'

export const activityMeetingNoteTmpId = 'tmp'

export default forwardRef(function ThreadActivities(
  styleProps: StyleProps,
  ref
) {
  const { t } = useTranslation()
  const { thread, activities, memberStatus } = useContext(ThreadContext)!
  const meetingState = useContext(MeetingContext)
  const currentMember = useCurrentMember()
  const scrollable = useContext(ScrollableContext)
  const { hash } = useLocation()

  // Scroll to the bottom on load, and when the last activity changes and was
  // created by the current member. Other members' new messages are left to the
  // scrollable layout (it keeps you at the bottom when already there).
  const loadedRef = useRef(false)
  const lastActivityIdRef = useRef<string | undefined>()

  useEffect(() => {
    if (!activities || !scrollable) return
    const lastActivity = activities[activities.length - 1]
    const lastId = lastActivity?.id

    if (!loadedRef.current) {
      loadedRef.current = true
      lastActivityIdRef.current = lastId

      // If the URL targets a specific activity (#activity-{id}), scroll to and
      // highlight it instead of pinning to the bottom. Deferred so the activity
      // is rendered before we scroll to it.
      const hashActivityId = getActivityIdFromHash(hash)
      if (hashActivityId && activities.some((a) => a.id === hashActivityId)) {
        setTimeout(() => scrollAndHighlightActivity(hashActivityId), 100)
        return
      }

      // Pin to bottom; the layout keeps following as async content grows
      scrollable.scrollToBottom(false)
      return
    }

    if (lastId && lastId !== lastActivityIdRef.current) {
      lastActivityIdRef.current = lastId
      if (lastActivity?.userId === currentMember?.userId) {
        scrollable.scrollToBottom(true)
      }
    }
  }, [activities])

  // Temporary meeting note
  const tmpMeetingNoteActivity = useMemo(() => {
    if (
      !thread ||
      !activities ||
      !meetingState?.meeting ||
      activities.some(
        (a) =>
          a.type === Thread_Activity_Type_Enum.MeetingNote &&
          a.refMeeting?.id === meetingState.meeting?.id
      )
    ) {
      return undefined
    }

    // Add temporary meeting note to activities
    return {
      id: activityMeetingNoteTmpId,
      threadId: thread.id,
      userId: '',
      createdAt: new Date().toISOString(),
      type: Thread_Activity_Type_Enum.MeetingNote,
      refMeeting: meetingState.meeting,
      reactions: [],
      member: null,
      data: {
        notes: '',
      },
    } as ThreadActivityMeetingNoteFragment
  }, [thread?.id, activities, meetingState?.meeting?.id])

  // Show read mark on last read activity:
  // - at first load
  // - when it changes for an activity that is not the last one
  const [lastReadActivityId, setLastReadActivityId] = useState<
    string | undefined
  >()

  // Update read mark at first load
  useEffect(() => {
    if (!thread || !activities || thread.id !== activities[0]?.threadId) {
      return
    }
    const lastActivityId = activities[activities.length - 1]?.id
    const readActivityId = memberStatus?.lastReadActivityId

    if (readActivityId && readActivityId !== lastActivityId) {
      // Set mark to last read activity when opening thread
      setLastReadActivityId(readActivityId)
    } else {
      // Reset
      setLastReadActivityId(undefined)
    }
  }, [thread?.id, activities?.[0]?.threadId])

  // Update read mark when last read activity changes
  useEffect(() => {
    if (!memberStatus || !activities) return
    const readActivityId = memberStatus.lastReadActivityId
    if (!readActivityId) return
    const activityExists = activities.some((a) => a.id === readActivityId)
    const lastActivityId = activities[activities.length - 1]?.id
    if (activityExists && readActivityId !== lastActivityId) {
      setLastReadActivityId(readActivityId)
    }
  }, [memberStatus?.lastReadActivityId])

  return (
    <>
      <ProposalScrollButton />
      <VStack spacing={0} mb={2} align="stretch" ref={ref} {...styleProps}>
      {activities &&
        activities.map((activity, i) => (
          <React.Fragment key={`activity_${activity.id}`}>
            {(i === 0 ||
              !isSameDay(
                new Date(activity.createdAt),
                new Date(activities[i - 1].createdAt)
              )) && <ThreadDaySeparator date={activity.createdAt} />}

            <ThreadActivity activity={activity} />

            {lastReadActivityId === activity.id && (
              <Box h="3px" w="100%" bg="red.200" _dark={{ bg: 'red.800' }} />
            )}
          </React.Fragment>
        ))}

      {activities?.length === 0 &&
        !tmpMeetingNoteActivity &&
        !thread?.archivedAt && (
          <Alert
            status="success"
            variant="subtle"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            textAlign="center"
            height="200px"
          >
            <ThreadIcon size={40} />
            <AlertTitle mt={4} mb={1} fontSize="lg">
              {t('ThreadActivities.emptyTitle')}
            </AlertTitle>
            <AlertDescription maxWidth="sm">
              {t('ThreadActivities.emptyDescription')}
            </AlertDescription>
          </Alert>
        )}

      {tmpMeetingNoteActivity && (
        <ThreadActivity activity={tmpMeetingNoteActivity} />
      )}
      </VStack>
    </>
  )
})
