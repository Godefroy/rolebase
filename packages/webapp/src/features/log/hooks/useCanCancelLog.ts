import useCurrentMember from '@/member/hooks/useCurrentMember'
import useOrgMember from '@/member/hooks/useOrgMember'
import useOrgOwner from '@/member/hooks/useOrgOwner'
import { useOrgContext } from '@/org/contexts/OrgContext'
import { LogFragment } from '@gql'
import { LogDisplay } from '@rolebase/shared/model/log'
import { useCallback } from 'react'

// Whether the current user may undo a log. Cancelling replays the inverse
// mutations with their own rights, so the action is only offered when the
// server would accept it (rules in OrgData, mirrored by Hasura). Returns a
// predicate so a list can test each of its logs.
export default function useCanCancelLog(): (log: LogFragment) => boolean {
  const { orgData } = useOrgContext()
  const currentMember = useCurrentMember()
  const isOrgMember = useOrgMember()
  const isOrgOwner = useOrgOwner()

  return useCallback(
    (log: LogFragment) =>
      !!orgData &&
      orgData.canCancelLog(
        log.display as LogDisplay,
        currentMember?.id,
        isOrgMember,
        isOrgOwner
      ),
    [orgData, currentMember, isOrgMember, isOrgOwner]
  )
}
