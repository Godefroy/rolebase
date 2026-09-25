import { useEffect, useState } from 'react'
import { trpc } from 'src/trpc'

export interface PendingInvitation {
  memberId: string
  token: string
  orgId: string
  orgName: string
}

// An invitation often arrives while the person waits in the onboarding wizard
// (they signed up before a colleague invited them): check again regularly
const REFRESH_INTERVAL = 30 * 1000

// Invitations waiting for the current user's email address, to offer joining
// an org instead of creating one. Only fetched when enabled, so users who
// already have an org never trigger the request.
export default function usePendingInvitations(enabled: boolean) {
  const [invitations, setInvitations] = useState<PendingInvitation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!enabled) return
    let active = true

    const fetchInvitations = () =>
      trpc.member.getPendingInvitations
        .query()
        .then((result) => active && setInvitations(result))
        .catch((error) => console.error(error))

    setLoading(true)
    fetchInvitations().finally(() => active && setLoading(false))

    const interval = setInterval(fetchInvitations, REFRESH_INTERVAL)
    window.addEventListener('focus', fetchInvitations)
    return () => {
      active = false
      clearInterval(interval)
      window.removeEventListener('focus', fetchInvitations)
    }
  }, [enabled])

  return { invitations, loading: enabled && loading }
}
