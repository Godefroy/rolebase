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
import useArchiveCircle from '@/circle/hooks/useArchiveCircle'
import useRestoreCircle from '@/circle/hooks/useRestoreCircle'
import { cancelLogChanges } from '@rolebase/shared/helpers/log/cancelLogChanges'
import { detectRecentEntitiesChanges } from '@rolebase/shared/helpers/log/detectRecentEntitiesChanges'
import { EntitiesMethods, LogDisplay, LogType } from '@rolebase/shared/model/log'
import { useCallback } from 'react'
import useCreateLog from './useCreateLog'

export function useCancelLog(log: LogFragment) {
  const createLog = useCreateLog()
  const [cancelLog] = useCancelLogMutation()
  const restoreCircle = useRestoreCircle()
  const archiveCircle = useArchiveCircle()

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
        const { data } = await getCircle({
          variables: { id },
          fetchPolicy: 'network-only',
        })
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
        const { data } = await getCircleMember({
          variables: { id },
          fetchPolicy: 'network-only',
        })
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
        const { data } = await getCircleLink({
          variables: { id },
          fetchPolicy: 'network-only',
        })
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
        const { data } = await getRole({
          variables: { id },
          fetchPolicy: 'network-only',
        })
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
    const display = log.display as LogDisplay

    // Circle archive/create cascade to the whole subtree server-side, so undo
    // them through the dedicated routes (no client write to circle.archivedAt),
    // not the partial entity revert below.
    if (display.type === LogType.CircleArchive) {
      // Restore the subtree; this also cancels the archive log.
      await restoreCircle(display.id)
      return
    }
    if (display.type === LogType.CircleCreate) {
      // Undo a circle creation/copy = archive the created subtree (logs its own
      // CircleArchive entry), then mark this creation log cancelled.
      await archiveCircle(display.id)
      await cancelLog({ variables: { id: log.id } })
      return
    }

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
      ...(!log.cancelLogId
        ? {
            cancelLogId: log.id,
            cancelMemberId: log.memberId,
            cancelMemberName: log.memberName,
          }
        : {}),
    })
  }, [log, restoreCircle, archiveCircle, cancelLog])

  return {
    hasChanged,
    cancel,
  }
}
