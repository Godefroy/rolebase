// Use this hook only in useDbOrgEditActions. Elsewhere, get the action from
// useOrgEditActions() so the active OrgContext implementation applies.
import { useStoreState } from '@store/hooks'
import { useCallback } from 'react'
import { trpc } from 'src/trpc'

// Archives a circle and its whole subtree (roles, members, links, meetings,
// recurring meetings, threads, tasks, decisions) and records the activity log,
// all server-side in one atomic operation.
export default function useArchiveCircle() {
  const currentMeetingId = useStoreState(
    (state) => state.memberStatus.currentMeetingId
  )

  return useCallback(
    async (circleId: string) => {
      await trpc.circle.archiveCircle.mutate({
        circleId,
        meetingId: currentMeetingId || null,
      })
    },
    [currentMeetingId]
  )
}
