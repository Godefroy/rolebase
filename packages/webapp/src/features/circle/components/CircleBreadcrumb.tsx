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
      minW={0}
      {...textProps}
    >
      {parents.map((c) => (
        <React.Fragment key={c.id}>
          {/* Keep each role name and its chevron together; only allow line
              breaks between segments (the <wbr/>), not inside a name. */}
          <chakra.span whiteSpace="nowrap">
            <CircleLink
              id={c.id}
              name={orgData?.getRole(c.roleId)?.name ?? ''}
              color="inherit"
              fontSize="sm"
              fontWeight={400}
            />
            <ChevronRightIcon mx="0.1rem" />
          </chakra.span>
          <wbr />
        </React.Fragment>
      ))}
    </Text>
  )
}
