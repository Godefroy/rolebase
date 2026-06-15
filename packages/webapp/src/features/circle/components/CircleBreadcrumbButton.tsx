import { useOrgContext } from '@/org/contexts/OrgContext'
import { Box, BoxProps, HStack } from '@chakra-ui/react'
import { CircleFragment } from '@gql'
import React from 'react'
import { CircleParentLinkIcon } from 'src/icons'
import CircleBreadcrumb from './CircleBreadcrumb'
import CircleButton from './CircleButton'
import CircleByIdButton from './CircleByIdButton'

interface Props extends BoxProps {
  circle: CircleFragment
  size?: 'sm' | 'md' | 'lg'
}

export default function CircleBreadcrumbButton({
  circle,
  size,
  ...boxProps
}: Props) {
  const { orgData } = useOrgContext()
  return (
    <Box pb="1em" mb={1} {...boxProps}>
      <CircleBreadcrumb circleId={circle.id} mb={1} />
      <HStack alignItems="center">
        <CircleButton circle={circle} size={size} noEllipsis />
        {orgData?.getRole(circle.roleId)?.parentLink && circle.parentId && (
          <>
            <Box color="gray.500" _dark={{ color: 'gray.300' }}>
              <CircleParentLinkIcon size="1.5em" />
            </Box>
            <CircleByIdButton id={circle.parentId} size={size} />
          </>
        )}
      </HStack>
    </Box>
  )
}
