import useCircle from '@/circle/hooks/useCircle'
import useCurrentMember from '@/member/hooks/useCurrentMember'
import useOrgMember from '@/member/hooks/useOrgMember'
import useCircleParticipants from '@/participants/hooks/useCircleParticipants'
import {
  CircleSummaryFragment,
  ThreadActivityFragment,
  ThreadFragment,
  ThreadMemberStatusFragment,
  Thread_Activity_Type_Enum,
  useThreadActivitiesLogsSubscription,
  useThreadSubscription,
  useUpsertThreadMemberStatusMutation,
} from '@gql'
import { ParticipantMember } from '@rolebase/shared/model/member'
import { ThreadActivityChangeStatusFragment } from '@rolebase/shared/model/thread_activity'
import { useCallback, useEffect, useMemo } from 'react'
import { usePathInOrg } from '../../org/hooks/usePathInOrg'
import useExtraParticipants from '../../participants/hooks/useExtraParticipants'

/***
 * Thread state hook
 * /!\ Do not call this too often
 * Consider using ThreadContext instead
 */

export interface ThreadState {
  thread: ThreadFragment | undefined
  memberStatus: ThreadMemberStatusFragment | undefined
  activities: ThreadActivityFragment[] | undefined
  loading: boolean
  error: Error | undefined
  path: string
  circle: CircleSummaryFragment | undefined
  participants: ParticipantMember[]
  canEdit: boolean
  canParticipate: boolean
  isParticipant: boolean
  handleMarkUnread(activityId: string): void
}

export default function useThreadState(threadId: string): ThreadState {
  const currentMember = useCurrentMember()
  const isMember = useOrgMember()
  const [upsertThreadMemberStatus] = useUpsertThreadMemberStatusMutation()

  // Subscribe to thread
  const threadResult = useThreadSubscription({
    skip: !currentMember,
    variables: {
      id: threadId,
      memberId: currentMember?.id!,
    },
  })
  const thread = threadResult.data?.thread_by_pk || undefined
  const memberStatus = thread?.member_status?.[0]

  // Subscribe to activities and logs
  const activitiesLogsResult = useThreadActivitiesLogsSubscription({
    variables: { id: threadId },
  })

  const activities =
    activitiesLogsResult.data?.thread_by_pk?.activities
      // Sort activities here because we need order before injectig logs
      .sort((a, b) => (a.createdAt > b.createdAt ? 1 : -1)) || undefined
  const threadLogs = activitiesLogsResult.data?.thread_by_pk?.logs || undefined

  // Error and loading
  const loading = threadResult.loading || activitiesLogsResult.loading
  const error = threadResult.error || activitiesLogsResult.error

  // Meeting page path
  const path = usePathInOrg(`threads/${thread?.id}`)

  // Circle
  const circle = useCircle(thread?.circleId)

  // Participants
  const circleParticipants = useCircleParticipants(circle)
  const participants = useExtraParticipants(
    circleParticipants,
    thread?.extra_members
  )

  // Is current member participant?
  const isParticipant = currentMember
    ? participants.some((p) => p.member.id === currentMember.id)
    : false
  const canEdit = isParticipant || (thread?.private === false && isMember)
  const canParticipate = canEdit

  // Mark an activity as unread
  const handleMarkUnread = useCallback(
    (activityId: string) => {
      if (!activities || !currentMember) return
      const activityIndex = activities.findIndex((a) => a.id === activityId)
      if (activityIndex === -1) {
        throw new Error('Activity not found')
      }
      const prevActivity = activities[activityIndex - 1]

      upsertThreadMemberStatus({
        variables: {
          values: {
            threadId,
            memberId: currentMember.id,
            lastReadActivityId: prevActivity?.id || null,
            lastReadDate: new Date().toISOString(),
          },
        },
      })
    },
    [activities, threadId, currentMember]
  )

  // Update member status when there is a new activity
  useEffect(() => {
    if (!activities || !thread || !currentMember) return

    // Already up to date?
    const lastActivityId = activities[activities.length - 1]?.id || null
    if (memberStatus?.lastReadActivityId === lastActivityId) {
      return
    }

    // Save new status
    upsertThreadMemberStatus({
      variables: {
        values: {
          threadId,
          memberId: currentMember.id,
          lastReadActivityId: lastActivityId,
          lastReadDate: new Date().toISOString(),
        },
      },
    })
  }, [!thread, activities])

  const threadLogsActivity = useMemo(() => {
    if (!thread || !threadLogs) {
      return undefined
    }

    return threadLogs.map((log) => {
      return {
        id: log.id,
        type: Thread_Activity_Type_Enum.ChangeStatus,
        userId: log.userId,
        createdAt: log.createdAt,
        data: {
          ...log,
        },
      } as ThreadActivityChangeStatusFragment
    })
  }, [thread, threadLogs])

  // Merge activities and logs sorted by createdAt asc
  const concatThreadLogsActivities = useMemo(() => {
    if (!activities || !threadLogsActivity) {
      return undefined
    }

    return activities
      .concat(threadLogsActivity || [])
      .sort((a, b) => (a.createdAt > b.createdAt ? 1 : -1))
  }, [activities, threadLogsActivity])

  return {
    thread,
    memberStatus,
    activities: concatThreadLogsActivities,
    loading,
    error,
    path,
    circle,
    participants,
    canEdit,
    canParticipate,
    isParticipant,
    handleMarkUnread,
  }
}
