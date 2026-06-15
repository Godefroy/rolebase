import { useOrgContext } from '@/org/contexts/OrgContext'
import { CircleFragment } from '@gql'
import { groupParticipantsByMember } from '@rolebase/shared/helpers/groupParticipantsByMember'
import { ParticipantMember } from '@rolebase/shared/model/member'
import { useMemo } from 'react'

export default function useCircleLeaders(
  circleOrId?: string | CircleFragment
): ParticipantMember[] {
  const { orgData } = useOrgContext()

  return useMemo(() => {
    const id = typeof circleOrId === 'string' ? circleOrId : circleOrId?.id
    if (!id || !orgData) return []

    // Compute leaders and group by member
    return groupParticipantsByMember(orgData.getLeaders(id))
  }, [circleOrId, orgData])
}
