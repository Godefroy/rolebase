import { useCallback, useEffect, useState } from 'react'
import { trpc } from 'src/trpc'

export interface ColleagueOrg {
  orgId: string
  orgName: string
  requestStatus: 'Pending' | 'Accepted' | 'Refused' | null
}

// An admin may answer while the person waits: check again regularly
const REFRESH_INTERVAL = 30 * 1000

// Orgs where colleagues with the same company email domain are members, with
// the status of the person's access request to each. Once a request is
// accepted, the person is a member and the org list takes over.
export default function useColleagueOrgs() {
  const [orgs, setOrgs] = useState<ColleagueOrg[]>([])
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(
    () =>
      trpc.member.getColleagueOrgs.query().then(setOrgs).catch(console.error),
    []
  )

  useEffect(() => {
    refresh().finally(() => setLoading(false))
  }, [])

  const hasPendingRequest = orgs.some((org) => org.requestStatus === 'Pending')
  useEffect(() => {
    if (!hasPendingRequest) return
    const interval = setInterval(refresh, REFRESH_INTERVAL)
    window.addEventListener('focus', refresh)
    return () => {
      clearInterval(interval)
      window.removeEventListener('focus', refresh)
    }
  }, [hasPendingRequest])

  return { orgs, loading, refresh }
}
