import { useStoreState } from '@store/hooks'
import { useCallback } from 'react'
import { trpc } from 'src/trpc'

// Restore an archived circle and its whole subtree (server-side, by archivedAt),
// and cancel the matching archive log. All handled atomically on the backend.
export default function useRestoreCircle() {
  const currentMeetingId = useStoreState(
    (state) => state.memberStatus.currentMeetingId
  )

  return useCallback(
    async (circleId: string) => {
      await trpc.circle.restoreCircle.mutate({
        circleId,
        meetingId: currentMeetingId || null,
      })
    },
    [currentMeetingId]
  )
}
