import useCurrentMember from '@/member/hooks/useCurrentMember'
import useOrgMember from '@/member/hooks/useOrgMember'
import { useOrgContext } from '@/org/contexts/OrgContext'
import useCircleParticipants from '@/participants/hooks/useCircleParticipants'
import {
  CircleFragment,
  ThreadActivityFragment,
  ThreadFragment,
  ThreadMemberStatusFragment,
  useThreadActivitiesSubscription,
  useThreadSubscription,
  useUpsertThreadMemberStatusMutation,
} from '@gql'
import { ParticipantMember } from '@rolebase/shared/model/member'
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
  circle: CircleFragment | undefined
  participants: ParticipantMember[]
  canEdit: boolean
  canParticipate: boolean
  isParticipant: boolean
  handleMarkUnread(activityId: string): void
}

export default function useThreadState(threadId: string): ThreadState {
  const currentMember = useCurrentMember()
  const isMember = useOrgMember()
  const { orgData } = useOrgContext()
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

  // Subscribe to activities
  const activitiesResult = useThreadActivitiesSubscription({
    variables: { id: threadId },
  })

  const activities = useMemo(
    () =>
      activitiesResult.data?.thread_by_pk?.activities
        .slice()
        .sort((a, b) => (a.createdAt > b.createdAt ? 1 : -1)) || undefined,
    [activitiesResult.data]
  )

  // Error and loading
  const loading = threadResult.loading || activitiesResult.loading
  const error = threadResult.error || activitiesResult.error

  // Meeting page path
  const path = usePathInOrg(`threads/${thread?.id}`)

  // Circle
  const circle = orgData?.getCircle(thread?.circleId)

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

  return {
    thread,
    memberStatus,
    activities,
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
