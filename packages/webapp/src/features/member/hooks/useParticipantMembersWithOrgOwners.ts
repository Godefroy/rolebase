import { useOrgContext } from '@/org/contexts/OrgContext'
import { ParticipantMember } from '@rolebase/shared/model/member'
import { useCallback, useMemo } from 'react'

// A member of a "who can do this" list, flagged when they hold the right as an
// owner of the organization rather than through the role itself.
export interface ParticipantMemberWithOrgOwner extends ParticipantMember {
  isOrgOwner?: boolean
}

// Completes a "who can do this" list with the owners of the organization, who
// hold every right on every role in every governance mode. An owner already in
// the list keeps the roles they hold it through and is flagged on top of them,
// so both reasons show.
export default function useParticipantMembersWithOrgOwners(): (
  members: readonly ParticipantMember[]
) => ParticipantMemberWithOrgOwner[] {
  const { orgData } = useOrgContext()
  const orgOwners = useMemo(() => orgData?.getOrgOwners() ?? [], [orgData])

  return useCallback(
    (members) => {
      const ownerIds = new Set(orgOwners.map((owner) => owner.id))
      return [
        ...members.map((m) =>
          ownerIds.has(m.member.id) ? { ...m, isOrgOwner: true } : m
        ),
        ...orgOwners
          .filter((owner) => !members.some((m) => m.member.id === owner.id))
          .map((member) => ({ member, circlesIds: [], isOrgOwner: true })),
      ]
    },
    [orgOwners]
  )
}
