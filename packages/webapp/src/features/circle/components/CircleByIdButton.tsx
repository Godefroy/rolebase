import { useOrgContext } from '@/org/contexts/OrgContext'
import { ButtonProps } from '@chakra-ui/react'
import React from 'react'
import CircleButton from './CircleButton'

interface Props extends ButtonProps {
  id: string
}

export default function CircleByIdButton({ id, ...buttonProps }: Props) {
  const { orgData } = useOrgContext()
  const circle = orgData?.getCircle(id)
  return circle ? <CircleButton circle={circle} {...buttonProps} /> : null
}
