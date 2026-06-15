import { useOrgContext } from '@/org/contexts/OrgContext'
import { CircleFragment } from '@gql'
import { groupParticipantsByMember } from '@rolebase/shared/helpers/groupParticipantsByMember'
import { ParticipantMember } from '@rolebase/shared/model/member'
import { useMemo } from 'react'

export default function useCircleParticipants(
  circleOrId?: string | CircleFragment,
  includeChildren = false
): ParticipantMember[] {
  const { orgData } = useOrgContext()

  return useMemo(() => {
    const id = typeof circleOrId === 'string' ? circleOrId : circleOrId?.id
    if (!id || !orgData) return []

    // Compute participants and group by member
    return groupParticipantsByMember(orgData.getParticipants(id, includeChildren))
  }, [circleOrId, orgData, includeChildren])
}
