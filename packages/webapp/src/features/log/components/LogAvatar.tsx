import MemberAvatar from '@/member/components/MemberAvatar'
import { useOrgContext } from '@/org/contexts/OrgContext'
import { Avatar, AvatarProps } from '@chakra-ui/react'
import React from 'react'

interface Props extends AvatarProps {
  id: string
  name: string
}

// Avatar of the author of a log. Falls back to the name stored in the log when
// the member has left the organization.
export default function LogAvatar({ id, name, ...avatarProps }: Props) {
  const { orgData } = useOrgContext()
  const member = orgData?.getMember(id)

  return member ? (
    <MemberAvatar member={member} {...avatarProps} />
  ) : (
    <Avatar name={name} {...avatarProps} />
  )
}
