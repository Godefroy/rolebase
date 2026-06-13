import { ChevronRightIcon } from '@chakra-ui/icons'
import { chakra, Text, TextProps } from '@chakra-ui/react'
import { getCircleAndParents } from '@rolebase/shared/helpers/getCircleAndParents'
import { useStoreState } from '@store/hooks'
import React, { useMemo } from 'react'
import CircleLink from './CircleLink'

interface Props extends TextProps {
  circleId: string
}

export default function CircleBreadcrumb({ circleId, ...textProps }: Props) {
  const circles = useStoreState((state) => state.org.circles)

  // Get circle parents, excluding the circle itself
  const parents = useMemo(() => {
    if (!circles) return undefined
    const circleAndParents = getCircleAndParents(circles, circleId)
    return circleAndParents.slice(0, circleAndParents.length - 1)
  }, [circles, circleId])

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
            name={c.role.name}
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
