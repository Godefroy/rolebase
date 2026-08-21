import useOrgMember from '@/member/hooks/useOrgMember'
import { useOrgContext } from '@/org/contexts/OrgContext'
import {
  Box,
  Button,
  Heading,
  Text,
  VStack,
  useDisclosure,
} from '@chakra-ui/react'
import React, { Suspense, lazy, useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { AddIcon } from 'src/icons'
import { CircleContext } from '../contexts/CIrcleContext'

// Lazy-loaded to break the import cycle CircleRole → CircleRoleNoRights →
// ProposalModal → ProposalGraphEditor → CircleContent → CircleRole.
const ProposalModal = lazy(() => import('@/proposal/modals/ProposalModal'))

// What the current member can't do here, listed in the order it reads in a
// sentence. Each maps to an infinitive fragment (`actionRole`, …) joined into
// the single explanation below.
const actionKeys = {
  role: 'actionRole',
  subRoles: 'actionSubRoles',
  members: 'actionMembers',
} as const

// Explains what the current member can't change on this role and how to get it
// changed: ask someone who holds the right, or submit a proposal. Who exactly
// holds it belongs to the Security menu, which this section points to. Shown
// only when a right is actually missing, so a full-rights member never sees it.
export default function CircleRoleNoRights() {
  const { t, i18n } = useTranslation()
  const { editable, isDraft } = useOrgContext()
  const isOrgMember = useOrgMember()
  const proposalModal = useDisclosure()

  const circleContext = useContext(CircleContext)
  if (!circleContext) return null
  const {
    circle,
    role,
    canEditCircle,
    canEditRole,
    canEditMembers,
    canEditSubCircles,
  } = circleContext

  // Nothing to explain outside a live, editable org chart.
  if (!isOrgMember || !editable || isDraft || circle.archivedAt) return null

  // A single-member or parent-link role never holds sub-roles, so that missing
  // right is only worth reporting on a role that could have them.
  const missingSubRoles =
    role.singleMember === false &&
    role.parentLink === false &&
    !canEditSubCircles
  if (canEditRole && canEditMembers && !missingSubRoles) return null

  // A base role's configuration is shared, so it stays reserved to the org
  // owners even through a proposal: it is explained apart rather than listed
  // among the actions a proposal could unlock.
  const isBaseRoleBlocked = role.base && !canEditRole

  const actions = [
    ...(!canEditRole && !isBaseRoleBlocked ? (['role'] as const) : []),
    ...(missingSubRoles ? (['subRoles'] as const) : []),
    ...(canEditMembers ? [] : (['members'] as const)),
  ]
  const actionsList = new Intl.ListFormat(i18n.language, {
    style: 'long',
    type: 'conjunction',
  }).format(
    actions.map((action) => t(`CircleRoleNoRights.${actionKeys[action]}`))
  )

  return (
    <>
      {/* A closing section of the role panel rather than a card nested in it. */}
      <Box
        mt={10}
        pt={5}
        borderTopWidth="1px"
        borderColor="gray.200"
        _dark={{ borderColor: 'gray.550' }}
      >
        {/* One title for every case: what differs is the explanation below. */}
        <Heading as="h3" size="sm" mb={3}>
          {t('CircleRoleNoRights.heading')}
        </Heading>

        <VStack spacing={3} align="stretch">
          {isBaseRoleBlocked && (
            <Text color="gray.500" _dark={{ color: 'gray.300' }}>
              {t('CircleRoleNoRights.baseText', { role: role.name })}
            </Text>
          )}

          {/* Same condition as the menu action (CircleContent): the right to
              edit the circle, and a role that is not the root one. */}
          {isBaseRoleBlocked && canEditCircle && circle.parentId && (
            <Text color="gray.500" _dark={{ color: 'gray.300' }}>
              {t('CircleRoleNoRights.baseSeparate')}
            </Text>
          )}

          {actions.length > 0 && (
            <Text color="gray.500" _dark={{ color: 'gray.300' }}>
              {t('CircleRoleNoRights.actionsText', { actions: actionsList })}
            </Text>
          )}

          {/* Who holds each right lives in the Security menu (CirclePrivacy),
              opened from the padlock in the panel header. */}
          <Text color="gray.500" _dark={{ color: 'gray.300' }}>
            {t('CircleRoleNoRights.seeWhoCanEdit')}
          </Text>

          {actions.length > 0 && (
            <Box>
              <Button
                leftIcon={<AddIcon size={20} />}
                colorScheme="blue"
                variant="outline"
                onClick={proposalModal.onOpen}
              >
                {t('CircleRoleNoRights.createProposal')}
              </Button>
            </Box>
          )}
        </VStack>
      </Box>

      {proposalModal.isOpen && (
        <Suspense fallback={null}>
          <ProposalModal
            isOpen
            circleId={circle.id}
            onClose={proposalModal.onClose}
          />
        </Suspense>
      )}
    </>
  )
}
