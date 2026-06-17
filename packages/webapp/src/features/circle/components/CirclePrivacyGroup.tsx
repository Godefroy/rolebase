import MemberMenuItem from '@/member/components/MemberMenuItem'
import { MenuGroup } from '@chakra-ui/react'
import { MemberFragment } from '@gql'
import { ParticipantMember } from '@rolebase/shared/model/member'
import React from 'react'
import CircleMemberLink from './CircleMemberLink'
import OrgOwnersItems from './OrgOwnersItems'

interface Props {
  title: string
  members: ParticipantMember[]
  orgOwners?: MemberFragment[]
}

// A titled group of members in the Security menu (e.g. who can modify the role,
// or who can assign members), followed by the organization's owners.
export default function CirclePrivacyGroup({ title, members, orgOwners }: Props) {
  return (
    <MenuGroup title={title}>
      {members.map(({ member, circlesIds }) => (
        <CircleMemberLink
          key={member.id}
          memberId={member.id}
          circleId={circlesIds[0]}
        >
          <MemberMenuItem member={member} circlesIds={circlesIds} />
        </CircleMemberLink>
      ))}
      <OrgOwnersItems members={orgOwners} excludeParticipants={members} />
    </MenuGroup>
  )
}
