import { useOrgContext } from '@/org/contexts/OrgContext'
import { AvatarProps } from '@chakra-ui/react'
import React from 'react'
import MemberAvatar from './MemberAvatar'

interface Props extends AvatarProps {
  id: string
  circleId?: string
}

export default function MemberByIdAvatar({ id, ...props }: Props) {
  const { orgData } = useOrgContext()
  const member = orgData?.getMember(id)

  return member ? <MemberAvatar member={member} {...props} /> : null
}
