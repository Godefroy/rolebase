import { useOrgContext } from '@/org/contexts/OrgContext'
import { ButtonProps } from '@chakra-ui/react'
import React from 'react'
import MemberButton from './MemberButton'

interface Props extends ButtonProps {
  id: string
}

export default function MemberByIdButton({ id, ...buttonProps }: Props) {
  const { orgData } = useOrgContext()
  const member = orgData?.getMember(id)
  return member ? <MemberButton member={member} {...buttonProps} /> : null
}
