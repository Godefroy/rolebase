import { useOrgContext } from '@/org/contexts/OrgContext'
import {
  IconButton,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Portal,
  Text,
  Tooltip,
  useDisclosure,
} from '@chakra-ui/react'
import { Governance_Mode_Enum } from '@gql'
import React, { Suspense, lazy, useContext } from 'react'
import { useTranslation } from 'react-i18next'
import useParticipantMembersWithOrgOwners from '@/member/hooks/useParticipantMembersWithOrgOwners'
import { AddIcon, PrivacyIcon } from 'src/icons'
import { ParticipantMember } from '@rolebase/shared/model/member'
import { CircleContext } from '../contexts/CIrcleContext'
import CirclePrivacyGroup from './CirclePrivacyGroup'

// Under strict governance no circle member holds the structural rights: the
// group then lists the org owners alone.
const noMembers: ParticipantMember[] = []

// Lazy-loaded to break the import cycle CircleContent → CirclePrivacy →
// ProposalModal → ProposalGraphEditor → CircleContent.
const ProposalModal = lazy(() => import('@/proposal/modals/ProposalModal'))

export default function CirclePrivacy() {
  const { t } = useTranslation()
  const { governanceMode } = useOrgContext()
  const proposalModal = useDisclosure()

  // Get circle context
  const circleContext = useContext(CircleContext)

  // Owners of the organization hold every right on every role, so each group
  // ends with them, flagged as such rather than listed apart.
  const withOrgOwners = useParticipantMembersWithOrgOwners()

  if (!circleContext) return null
  const { circle, role, owners, leaders, hasParentLinkMembers } = circleContext

  // The privacy menu is only relevant when governance is protected (not Free)
  if (governanceMode === Governance_Mode_Enum.Free) return null

  // Under strict governance the org chart is read-only: changes go through
  // proposals. Members can still be assigned by the circle's leaders/owners.
  const isStrict = governanceMode === Governance_Mode_Enum.Strict
  const memberAssigners = hasParentLinkMembers ? leaders : owners
  const showSubRoles = !role.parentLink && !role.singleMember

  return (
    <>
      <Menu isLazy autoSelect={false}>
        <Tooltip label={t('CirclePrivacy.tooltip')} hasArrow>
          <MenuButton
            as={IconButton}
            icon={<PrivacyIcon size={20} />}
            variant="ghost"
            size="sm"
            p={1}
          />
        </Tooltip>

        <Portal>
          <MenuList shadow="lg" zIndex={2000} maxH="390px" overflow="auto">
            {isStrict && (
              <Text
                px={3}
                pt={1}
                pb={2}
                maxW="20rem"
                whiteSpace="normal"
                fontSize="sm"
                color="gray.500"
                _dark={{ color: 'gray.400' }}
              >
                {t('CirclePrivacy.strictExplanation')}
              </Text>
            )}

            <MenuItem
              icon={<AddIcon size={20} />}
              onClick={proposalModal.onOpen}
            >
              {t('CirclePrivacy.createProposal')}
            </MenuItem>

            <MenuDivider />

            {isStrict ? (
              <>
                <CirclePrivacyGroup
                  title={t(
                    showSubRoles
                      ? 'CirclePrivacy.roleAndSubRoles'
                      : 'CirclePrivacy.role',
                    { role: role.name }
                  )}
                  members={withOrgOwners(noMembers)}
                />

                <MenuDivider />

                <CirclePrivacyGroup
                  title={t('CirclePrivacy.whoCanAssignMembers')}
                  members={withOrgOwners(memberAssigners)}
                />
              </>
            ) : (
              <>
                <CirclePrivacyGroup
                  title={t(
                    `CirclePrivacy.role${
                      hasParentLinkMembers ? '' : '_members'
                    }`,
                    { role: role.name }
                  )}
                  members={withOrgOwners(owners)}
                />

                {showSubRoles && (
                  <>
                    <MenuDivider />
                    <CirclePrivacyGroup
                      title={t(
                        `CirclePrivacy.subRoles${
                          hasParentLinkMembers ? '_members' : ''
                        }`
                      )}
                      members={withOrgOwners(leaders)}
                    />
                  </>
                )}
              </>
            )}
          </MenuList>
        </Portal>
      </Menu>

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
