import {
  AVATAR_SM_WIDTH,
  getResizedImageUrl,
} from '@rolebase/shared/helpers/getResizedImageUrl'
import { Avatar, AvatarProps, Center } from '@chakra-ui/react'
import { SearchTypes } from '@rolebase/shared/model/search'
import React from 'react'
import {
  CircleIcon,
  CirclePick,
  DecisionIcon,
  MeetingIcon,
  MemberIcon,
  RoleIcon,
  TaskIcon,
  ThreadIcon,
} from 'src/icons'
import { SearchItem } from '../searchTypes'

interface Props {
  item: SearchItem
  size?: AvatarProps['size']
}

export const searchIcons = {
  Member: MemberIcon,
  Role: RoleIcon,
  Circle: CircleIcon,
  Thread: ThreadIcon,
  Meeting: MeetingIcon,
  Task: TaskIcon,
  Decision: DecisionIcon,
  PickCircle: CirclePick,
}

export default function SearchResultIcon({ item, size }: Props) {
  if (item.type === SearchTypes.Member) {
    return (
      <Avatar
        name={item.title}
        src={getResizedImageUrl(item.picture, AVATAR_SM_WIDTH) || undefined}
        size={size === 'sm' ? 'xs' : 'sm'}
        ml="-8px"
      />
    )
  }
  if (item.type === SearchTypes.CreateAction) {
    return null
  }

  const Icon = searchIcons[item.type]
  const iconSize = size === 'sm' ? '20px' : '24px'

  return (
    <Center w={iconSize} h={iconSize}>
      <Icon size={iconSize} />
    </Center>
  )
}
