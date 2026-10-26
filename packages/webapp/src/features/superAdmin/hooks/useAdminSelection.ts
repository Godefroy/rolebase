import { useCallback } from 'react'
import { useSearchParams } from 'react-router'

// Org or user opened in the admin side panel, kept in the URL (?org= / ?user=)
export default function useAdminSelection() {
  const [searchParams, setSearchParams] = useSearchParams()

  const select = useCallback(
    (key?: 'org' | 'user', id?: string) =>
      setSearchParams((params) => {
        params.delete('org')
        params.delete('user')
        if (key && id) params.set(key, id)
        return params
      }),
    [setSearchParams]
  )

  return {
    orgId: searchParams.get('org') ?? undefined,
    userId: searchParams.get('user') ?? undefined,
    openOrg: useCallback((id: string) => select('org', id), [select]),
    openUser: useCallback((id: string) => select('user', id), [select]),
    close: useCallback(() => select(), [select]),
  }
}
