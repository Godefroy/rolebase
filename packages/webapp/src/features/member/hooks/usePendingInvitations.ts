import { useEffect, useState } from 'react'
import { trpc } from 'src/trpc'

export interface PendingInvitation {
  memberId: string
  token: string
  orgId: string
  orgName: string
}

// Invitations waiting for the current user's email address, to offer joining
// an org instead of creating one. Only fetched when enabled, so users who
// already have an org never trigger the request.
export default function usePendingInvitations(enabled: boolean) {
  const [invitations, setInvitations] = useState<PendingInvitation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!enabled) return
    setLoading(true)
    trpc.member.getPendingInvitations
      .query()
      .then(setInvitations)
      .catch((error) => console.error(error))
      .finally(() => setLoading(false))
  }, [enabled])

  return { invitations, loading: enabled && loading }
}
