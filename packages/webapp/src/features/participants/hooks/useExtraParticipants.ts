import { useOrgContext } from '@/org/contexts/OrgContext'
import { truthy } from '@rolebase/shared/helpers/truthy'
import { ParticipantMember } from '@rolebase/shared/model/member'
import { useMemo } from 'react'

export default function useExtraParticipants(
  participants?: ParticipantMember[],
  membersIds?: Array<string | { memberId: string }>
): ParticipantMember[] {
  const members = useOrgContext().orgData?.members

  return useMemo(() => {
    return [
      ...(participants || []),
      ...(membersIds || [])
        .map((memberId): ParticipantMember | undefined => {
          if (typeof memberId !== 'string') {
            memberId = memberId.memberId
          }

          // Don't duplicate
          if (participants?.some((p) => p.member.id === memberId)) return

          // Retrieve member
          const member = members?.find((m) => m.id === memberId)
          if (!member) return

          return { member, circlesIds: [] }
        })
        .filter(truthy),
    ]
  }, [participants, membersIds, members])
}
