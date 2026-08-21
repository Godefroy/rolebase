import MemberMenuItem from '@/member/components/MemberMenuItem'
import { ParticipantMemberWithOrgOwner } from '@/member/hooks/useParticipantMembersWithOrgOwners'
import { MenuGroup } from '@chakra-ui/react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import CircleMemberLink from './CircleMemberLink'

interface Props {
  title: string
  members: ParticipantMemberWithOrgOwner[]
}

// A titled group of members in the Security menu (e.g. who can modify the role,
// or who can assign members).
export default function CirclePrivacyGroup({ title, members }: Props) {
  const { t } = useTranslation()

  return (
    <MenuGroup title={title}>
      {members.map(({ member, circlesIds, isOrgOwner }) => (
        <CircleMemberLink
          key={member.id}
          memberId={member.id}
          circleId={circlesIds[0]}
        >
          <MemberMenuItem
            member={member}
            circlesIds={circlesIds}
            description={isOrgOwner ? t('CirclePrivacy.roleOwner') : undefined}
          />
        </CircleMemberLink>
      ))}
    </MenuGroup>
  )
}
