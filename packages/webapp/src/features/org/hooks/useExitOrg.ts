import { useStoreActions, useStoreState } from '@store/hooks'
import { useCallback } from 'react'
import { useNavigate } from 'react-router'

// Leaves the pages of an org the user just archived or left. The org is
// removed from the user's orgs right away, otherwise the root page would open
// it again before the subscription updates.
export default function useExitOrg() {
  const navigate = useNavigate()
  const orgs = useStoreState((state) => state.orgs.entries)
  const setOrgs = useStoreActions(
    (actions) => actions.orgs.setSubscriptionResult
  )

  return useCallback(
    (orgId: string) => {
      setOrgs({
        entries: orgs?.filter((org) => org.id !== orgId),
        loading: false,
        error: undefined,
      })
      navigate('/')
    },
    [orgs, setOrgs, navigate]
  )
}
