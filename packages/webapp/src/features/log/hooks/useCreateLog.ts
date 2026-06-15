import useCurrentMember from '@/member/hooks/useCurrentMember'
import { useOrgContext } from '@/org/contexts/OrgContext'
import { LogFragment, useCreateLogMutation } from '@gql'
import { Optional } from '@rolebase/shared/model/types'
import { useStoreState } from '@store/hooks'
import { useCallback, useRef } from 'react'

export default function useCreateLog() {
  const { orgId } = useOrgContext()
  const currentMember = useCurrentMember()
  const currentMeetingId = useStoreState(
    (state) => state.memberStatus.currentMeetingId
  )
  const [createLog] = useCreateLogMutation()

  // Read the latest values via a ref so the returned callback stays stable
  // (it is captured by the org edit action hooks).
  const ref = useRef({ orgId, currentMember, currentMeetingId })
  ref.current = { orgId, currentMember, currentMeetingId }

  return useCallback(
    async (
      log: Optional<
        Omit<
          LogFragment,
          | 'id'
          | 'orgId'
          | 'userId'
          | 'memberId'
          | 'memberName'
          | 'createdAt'
          | 'canceled'
        >,
        'meetingId'
      >
    ) => {
      const { orgId, currentMember, currentMeetingId } = ref.current
      if (!orgId) throw new Error('No orgId')
      if (!currentMember) throw new Error('No currentMember')

      await createLog({
        variables: {
          values: {
            orgId,
            memberId: currentMember.id,
            memberName: currentMember.name,
            meetingId: currentMeetingId || null,
            ...log,
          },
        },
      })
    },
    [createLog]
  )
}
