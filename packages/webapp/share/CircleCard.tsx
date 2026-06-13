import CircleBreadcrumb from '@/circle/components/CircleBreadcrumb'
import CircleByIdButton from '@/circle/components/CircleByIdButton'
import CircleRole from '@/circle/components/CircleRole'
import { CircleContext } from '@/circle/contexts/CIrcleContext'
import { Box, Flex, Heading, ModalCloseButton } from '@chakra-ui/react'
import React, { useContext } from 'react'
import { CircleParentLinkIcon } from 'src/icons'

interface Props {
  id: string
}

export default function CircleCard({ id }: Props) {
  const circleContext = useContext(CircleContext)
  if (!circleContext) return null

  const { circle } = circleContext

  return (
    <Box p={5}>
      <ModalCloseButton />
      <CircleBreadcrumb circleId={circle.id} mb={2} />
      <Flex alignItems="center" gap={3} mb={5}>
        <Heading as="h1" size="md" fontWeight="bold">
          {circle.role.name}
        </Heading>
        {circle.role.parentLink && circle.parentId && (
          <>
            <Box color="gray.500" _dark={{ color: 'gray.300' }}>
              <CircleParentLinkIcon size="1.5em" />
            </Box>
            <CircleByIdButton id={circle.parentId} size="md" />
          </>
        )}
      </Flex>
      <CircleRole skipFetchRole />
    </Box>
  )
}
