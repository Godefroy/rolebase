import { CircleFullFragment } from '@gql'
import { getCircleLeaders } from '@rolebase/shared/helpers/getCircleLeaders'
import { groupParticipantsByMember } from '@rolebase/shared/helpers/groupParticipantsByMember'
import { useOrgData } from '@/org/contexts/OrgDataContext'
import { ParticipantMember } from '@rolebase/shared/model/member'
import { useMemo } from 'react'

export default function useCircleLeaders(
  circleOrId?: string | CircleFullFragment
): ParticipantMember[] {
  const { circles } = useOrgData()

  return useMemo(() => {
    if (!circleOrId || !circles) return []

    // Compute leaders and group by member
    return groupParticipantsByMember(getCircleLeaders(circleOrId, circles))
  }, [circleOrId, circles])
}
