import { useOrgContext, useOrgEditActions } from '@/org/contexts/OrgContext'
import useOrgBaseRoles from '@/org/hooks/useOrgBaseRoles'
import CircleSearchButton from '@/search/components/CircleSearchButton'
import {
  Box,
  Flex,
  HStack,
  Heading,
  Icon,
  IconButton,
  Tooltip,
  VStack,
  useDisclosure,
} from '@chakra-ui/react'
import { RoleSummaryFragment } from '@gql'
import React, { useCallback, useContext, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FiX } from 'react-icons/fi'
import { CircleLinkIcon, CreateIcon } from 'src/icons'
import BaseRoleSearchButton from '../../search/components/BaseRoleSearchButton'
import { CircleContext } from '../contexts/CIrcleContext'
import CircleLinkDeleteModal from '../modals/CircleLinkDeleteModal'
import CircleWithLeaderItem from './CircleWithLeaderItem'

export default function CircleRoleSubCircles() {
  const { t } = useTranslation()

  // Get circle context
  const circleContext = useContext(CircleContext)
  if (!circleContext) return null
  const {
    circle,
    participants,
    canEditSubCircles,
    canEditSubCirclesParentLinks,
  } = circleContext

  const { orgData } = useOrgContext()
  const roles = useOrgBaseRoles()
  const { createCircle, addCircleLink } = useOrgEditActions()

  // CircleLinkDeleteModal
  const [linkToDeleteId, setLinkToDeleteId] = useState<string | undefined>()
  const {
    isOpen: isDeleteLinkOpen,
    onOpen: onDeleteLinkOpen,
    onClose: onDeleteLinkClose,
  } = useDisclosure()

  // Get direct circles children
  const subCircles = useMemo(
    () =>
      orgData?.circles
        .filter((c) => c.parentId === circle.id)
        .sort((a, b) => {
          const roleA = orgData.getRole(a.roleId)
          const roleB = orgData.getRole(b.roleId)
          // Put leaders at the top
          if (roleA?.parentLink && !roleB?.parentLink) {
            return -1
          }
          if (!roleA?.parentLink && roleB?.parentLink) {
            return 1
          }
          // Sort by name
          return (roleA?.name ?? '').localeCompare(roleB?.name ?? '')
        }),
    [orgData, circle]
  )

  const subRolesIds = useMemo(
    () => subCircles?.map((c) => c.roleId),
    [subCircles]
  )

  const highlightButton = subRolesIds?.length === 0 && participants.length === 0

  // Create sub-circle (and its role if a name is given)
  const handleCreateCircle = useCallback(
    (roleOrName: RoleSummaryFragment | string) =>
      createCircle(circle.id, roleOrName),
    [circle, createCircle]
  )

  const handleAddRole = useCallback(
    async (roleId: string) => {
      const role = roles?.find((r) => r.id === roleId)
      if (!role) return
      handleCreateCircle(role)
    },
    [handleCreateCircle, roles]
  )

  // When the user only leads the parent circle (not this one), they can only
  // add a representative (parent-link) sub-circle, not create roles here.
  const onlyParentLink = canEditSubCirclesParentLinks && !canEditSubCircles

  // Get invited circles (links)
  const invitedCircles = useMemo(
    () =>
      orgData
        ? [...orgData.invitedCirclesOf(circle.id)].sort((a, b) =>
            (orgData.getRole(a.roleId)?.name ?? '').localeCompare(
              orgData.getRole(b.roleId)?.name ?? ''
            )
          )
        : undefined,
    [orgData, circle]
  )

  // List of circles ids to exclude from circle search when adding a link
  const excludedCirclesIds = useMemo(() => {
    // Exclude current circle
    const ids = [circle.id]
    // Exclude parent circle
    if (circle.parentId) ids.push(circle.parentId)
    // Exclude already invited circle
    if (invitedCircles) ids.push(...invitedCircles.map((c) => c.id))
    // Exclude children circles
    const children = orgData?.circles.filter((c) => c.parentId === circle.id)
    if (children) ids.push(...children.map((c) => c.id))
    return ids
  }, [circle, invitedCircles, orgData])

  const handleAddLink = useCallback(
    async (circleId: string) => {
      addCircleLink(circle.id, circleId)
    },
    [circle]
  )

  const handleDeleteLink = useCallback((circleId: string) => {
    setLinkToDeleteId(circleId)
    onDeleteLinkOpen()
  }, [])

  // Hide if read only and empty
  if (
    !canEditSubCircles &&
    !canEditSubCirclesParentLinks &&
    !subCircles?.length &&
    !invitedCircles?.length
  ) {
    return null
  }

  return (
    <Box>
      {isDeleteLinkOpen && linkToDeleteId && (
        <CircleLinkDeleteModal
          parentId={circle.id}
          circleId={linkToDeleteId}
          isOpen
          onClose={onDeleteLinkClose}
        />
      )}

      <Heading as="h3" size="sm" mb={3}>
        {t('CircleRoleSubCircles.roles')}
      </Heading>
      <VStack spacing={2} align="start">
        {subCircles?.map((subCircle, i) => (
          <CircleWithLeaderItem
            key={subCircle.id}
            circle={subCircle}
            parentCircle={circle}
            participants={participants}
          />
        ))}

        {invitedCircles?.map((invitedCircle, i) => (
          <Flex key={invitedCircle.id} alignItems="center">
            <CircleWithLeaderItem
              circle={invitedCircle}
              parentCircle={circle}
              participants={participants}
              isInvited
            />
            <Tooltip
              label={t('CircleRoleSubCircles.linkTooltip')}
              placement="top"
              hasArrow
            >
              <Icon as={CircleLinkIcon} ml={2} />
            </Tooltip>
            {canEditSubCircles && (
              <Tooltip
                label={t('CircleRoleSubCircles.removeLink')}
                placement="top"
                hasArrow
              >
                <IconButton
                  aria-label={t('common.remove')}
                  icon={<FiX />}
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    handleDeleteLink(invitedCircle.id)
                  }}
                />
              </Tooltip>
            )}
          </Flex>
        ))}

        <HStack>
          {(canEditSubCircles || canEditSubCirclesParentLinks) && (
            <BaseRoleSearchButton
              excludeIds={subRolesIds}
              size="sm"
              variant={highlightButton ? 'solid' : 'outline'}
              colorScheme={highlightButton ? 'blue' : undefined}
              borderRadius="full"
              parentLink={
                onlyParentLink
                  ? true
                  : !canEditSubCirclesParentLinks && canEditSubCircles
                  ? false
                  : undefined
              }
              leftIcon={<CreateIcon size={20} />}
              onSelect={handleAddRole}
              onCreate={canEditSubCircles ? handleCreateCircle : undefined}
            >
              {t(
                onlyParentLink
                  ? 'CircleRoleSubCircles.addRepresentative'
                  : 'CircleRoleSubCircles.addRole'
              )}
            </BaseRoleSearchButton>
          )}

          {canEditSubCircles && (
            <CircleSearchButton
              excludeIds={excludedCirclesIds}
              size="sm"
              variant="outline"
              borderRadius="full"
              leftIcon={<CircleLinkIcon size={20} />}
              onSelect={handleAddLink}
            >
              {t('CircleRoleSubCircles.inviteRole')}
            </CircleSearchButton>
          )}
        </HStack>
      </VStack>
    </Box>
  )
}
