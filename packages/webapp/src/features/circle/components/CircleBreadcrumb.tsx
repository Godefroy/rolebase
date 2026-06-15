import { useOrgContext } from '@/org/contexts/OrgContext'
import { ChevronRightIcon } from '@chakra-ui/icons'
import { chakra, Text, TextProps } from '@chakra-ui/react'
import React, { useMemo } from 'react'
import CircleLink from './CircleLink'

interface Props extends TextProps {
  circleId: string
}

export default function CircleBreadcrumb({ circleId, ...textProps }: Props) {
  const { orgData } = useOrgContext()

  // Get circle parents, excluding the circle itself
  const parents = useMemo(() => {
    if (!orgData) return undefined
    const circleAndParents = orgData.andParentsOf(circleId)
    return circleAndParents.slice(0, circleAndParents.length - 1)
  }, [orgData, circleId])

  if (!parents || parents.length === 0) return null

  return (
    <Text
      lineHeight="1em"
      color="gray.500"
      _dark={{ color: 'gray.300' }}
      {...textProps}
    >
      {parents.map((c) => (
        <chakra.span whiteSpace="nowrap" key={c.id}>
          <CircleLink
            id={c.id}
            name={orgData?.getRole(c.roleId)?.name ?? ''}
            color="inherit"
            fontSize="sm"
            fontWeight={400}
            whiteSpace="normal"
          />
          <ChevronRightIcon mx="0.1rem" />
        </chakra.span>
      ))}
    </Text>
  )
}
