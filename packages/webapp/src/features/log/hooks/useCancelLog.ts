import { useAsyncMemo } from '@/common/hooks/useAsyncMemo'
import {
  LogFragment,
  useCancelLogMutation,
  useGetCircleLazyQuery,
  useGetCircleLinkLazyQuery,
  useGetCircleMemberLazyQuery,
  useGetRoleLazyQuery,
  useUpdateCircleLinkMutation,
  useUpdateCircleMemberMutation,
  useUpdateCircleMutation,
  useUpdateRoleMutation,
} from '@gql'
import { cancelLogChanges } from '@rolebase/shared/helpers/log/cancelLogChanges'
import { detectRecentEntitiesChanges } from '@rolebase/shared/helpers/log/detectRecentEntitiesChanges'
import { EntitiesMethods } from '@rolebase/shared/model/log'
import { useCallback } from 'react'
import useCreateLog from './useCreateLog'

export function useCancelLog(log: LogFragment) {
  const createLog = useCreateLog()
  const [cancelLog] = useCancelLogMutation()

  const [getCircle] = useGetCircleLazyQuery()
  const [updateCircle] = useUpdateCircleMutation()
  const [getRole] = useGetRoleLazyQuery()
  const [updateRole] = useUpdateRoleMutation()
  const [getCircleMember] = useGetCircleMemberLazyQuery()
  const [updateCircleMember] = useUpdateCircleMemberMutation()
  const [getCircleLink] = useGetCircleLinkLazyQuery()
  const [updateCircleLink] = useUpdateCircleLinkMutation()

  const methods: EntitiesMethods = {
    circles: {
      async get(id: string) {
        const { data } = await getCircle({ variables: { id } })
        return data?.circle_by_pk || undefined
      },
      async update(id, values) {
        const { data } = await updateCircle({ variables: { id, values } })
        if (!data?.update_circle_by_pk) {
          throw new Error('Unauthorized')
        }
      },
    },
    circlesMembers: {
      async get(id: string) {
        const { data } = await getCircleMember({ variables: { id } })
        return data?.circle_member_by_pk || undefined
      },
      async update(id, values) {
        const { data } = await updateCircleMember({
          variables: { id, values },
        })
        if (!data?.update_circle_member_by_pk) {
          throw new Error('Unauthorized')
        }
      },
    },
    circlesLinks: {
      async get(id: string) {
        const { data } = await getCircleLink({ variables: { id } })
        return data?.circle_link_by_pk || undefined
      },
      async update(id, values) {
        const { data } = await updateCircleLink({ variables: { id, values } })
        if (!data?.update_circle_link_by_pk) {
          throw new Error('Unauthorized')
        }
      },
    },
    roles: {
      async get(id: string) {
        const { data } = await getRole({ variables: { id } })
        return data?.role_by_pk || undefined
      },
      async update(id, values) {
        const { data } = await updateRole({ variables: { id, values } })
        if (!data?.update_role_by_pk) {
          throw new Error('Unauthorized')
        }
      },
    },
  }

  // Detect changes in logged updated entities since the log
  const hasChanged = useAsyncMemo(
    () => detectRecentEntitiesChanges(log, methods),
    [log],
    false
  )

  // Cancel log
  const cancel = useCallback(async () => {
    // Revert changes
    const changes = await cancelLogChanges(log, methods)

    // No changes, don't cancel log
    if (Object.values(changes).every((c) => c.length === 0)) return

    await cancelLog({ variables: { id: log.id } })

    // Log cancelation
    createLog({
      display: log.display,
      changes,
      meetingId: log.meetingId,
      taskId: log.taskId,
      threadId: log.threadId,
      ...(!log.cancelLogId
        ? {
            cancelLogId: log.id,
            cancelMemberId: log.memberId,
            cancelMemberName: log.memberName,
          }
        : {}),
    })
  }, [log])

  return {
    hasChanged,
    cancel,
  }
}
