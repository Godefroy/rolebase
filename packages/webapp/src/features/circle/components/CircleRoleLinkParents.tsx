import { useOrgContext } from '@/org/contexts/OrgContext'
import { Box, Flex, Heading, Icon, Tooltip, VStack } from '@chakra-ui/react'
import React, { useContext, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { CircleLinkIcon } from 'src/icons'
import { CircleContext } from '../contexts/CIrcleContext'
import CircleWithLeaderItem from './CircleWithLeaderItem'

export default function CircleRoleLinkParents() {
  const { t } = useTranslation()

  // Get circle context
  const circleContext = useContext(CircleContext)
  if (!circleContext) return null
  const { circle, parentCircle, participants } = circleContext

  const { orgData } = useOrgContext()

  // Get parent circles that have invited this circle (links)
  const invitingParentCircles = useMemo(
    () =>
      orgData
        ?.invitingCirclesOf(circle.id)
        .sort((a, b) =>
          (orgData.getRole(a.roleId)?.name ?? '').localeCompare(
            orgData.getRole(b.roleId)?.name ?? ''
          )
        ),
    [orgData, circle]
  )

  // Hide if empty and no parent circle
  if (!parentCircle && !invitingParentCircles?.length) {
    return null
  }

  return (
    <Box>
      <Heading as="h3" size="sm" mb={3}>
        {t('CircleRoleLinkParents.title')}
      </Heading>
      <VStack spacing={2} align="start">
        {parentCircle && (
          <CircleWithLeaderItem
            circle={parentCircle}
            parentCircle={circle}
            participants={participants}
          />
        )}

        {invitingParentCircles?.map((invitingCircle, i) => (
          <Flex key={invitingCircle.id} alignItems="center">
            <CircleWithLeaderItem
              circle={invitingCircle}
              parentCircle={circle}
              participants={participants}
            />
            <Tooltip
              label={t('CircleRoleSubCircles.linkTooltip')}
              placement="top"
              hasArrow
            >
              <Icon as={CircleLinkIcon} ml={2} />
            </Tooltip>
          </Flex>
        ))}
      </VStack>
    </Box>
  )
}
