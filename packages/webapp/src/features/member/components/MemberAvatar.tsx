import {
  AVATAR_SM_WIDTH,
  getResizedImageUrl,
} from '@rolebase/shared/helpers/getResizedImageUrl'
import { Avatar, AvatarProps, Tooltip } from '@chakra-ui/react'
import { MemberSummaryFragment } from '@gql'
import React from 'react'
import CircleMemberLink from '../../circle/components/CircleMemberLink'

interface Props extends AvatarProps {
  member: MemberSummaryFragment
  circleId?: string
  noTooltip?: boolean
}

export default function MemberAvatar({
  member,
  circleId,
  noTooltip,
  ...avatarProps
}: Props) {
  return member ? (
    <CircleMemberLink memberId={member.id} circleId={circleId}>
      <Tooltip label={noTooltip ? '' : member.name} placement="top" hasArrow>
        <Avatar
          name={member.name}
          src={getResizedImageUrl(member.picture, AVATAR_SM_WIDTH) || undefined}
          {...avatarProps}
        />
      </Tooltip>
    </CircleMemberLink>
  ) : null
}
