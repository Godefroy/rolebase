import { CircleFullFragment } from '@gql'
import { getAllCircleMembersParticipants } from '@rolebase/shared/helpers/getAllCircleMembersParticipants'
import { getCircleParticipants } from '@rolebase/shared/helpers/getCircleParticipants'
import { groupParticipantsByMember } from '@rolebase/shared/helpers/groupParticipantsByMember'
import { useOrgData } from '@/org/contexts/OrgDataContext'
import { ParticipantMember } from '@rolebase/shared/model/member'
import { useMemo } from 'react'

export default function useCircleParticipants(
  circleOrId?: string | CircleFullFragment,
  includeChildren = false
): ParticipantMember[] {
  const { circles } = useOrgData()

  return useMemo(() => {
    if (!circles || !circleOrId) return []

    // Compute participants and group by member
    return groupParticipantsByMember(
      includeChildren
        ? getAllCircleMembersParticipants(circleOrId, circles)
        : getCircleParticipants(circleOrId, circles)
    )
  }, [circleOrId, circles, includeChildren])
}
