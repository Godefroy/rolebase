import { useCallback, useEffect, useState } from 'react'
import { trpc } from 'src/trpc'

export interface OrgAccessRequest {
  id: string
  createdAt: string
  name: string
  email: string
  avatarUrl: string
}

// Pending requests to join the org (from colleagues with the same company
// email domain), loaded for admins only
export default function useOrgAccessRequests(orgId?: string, enabled = true) {
  const [requests, setRequests] = useState<OrgAccessRequest[]>([])

  const refresh = useCallback(async () => {
    if (!orgId || !enabled) return
    await trpc.member.getOrgAccessRequests
      .query({ orgId })
      .then(setRequests)
      .catch(console.error)
  }, [orgId, enabled])

  useEffect(() => {
    refresh()
  }, [refresh])

  return { requests, refresh }
}
