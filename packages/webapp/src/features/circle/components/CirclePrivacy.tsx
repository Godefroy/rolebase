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
import { Governance_Mode_Enum, Member_Role_Enum } from '@gql'
import React, { Suspense, lazy, useContext, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { AddIcon, PrivacyIcon } from 'src/icons'
import { CircleContext } from '../contexts/CIrcleContext'
import CirclePrivacyGroup from './CirclePrivacyGroup'

// Lazy-loaded to break the import cycle CircleContent → CirclePrivacy →
// ProposalModal → ProposalGraphEditor → CircleContent.
const ProposalModal = lazy(() => import('@/proposal/modals/ProposalModal'))

export default function CirclePrivacy() {
  const { t } = useTranslation()
  const { governanceMode, orgData } = useOrgContext()
  const proposalModal = useDisclosure()

  // Get circle context
  const circleContext = useContext(CircleContext)

  // Get organization's owners
  const members = orgData?.members
  const orgOwners = useMemo(
    () => members?.filter((m) => m.role === Member_Role_Enum.Owner),
    [members]
  )

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

            <MenuItem icon={<AddIcon size={20} />} onClick={proposalModal.onOpen}>
              {t('CirclePrivacy.createProposal')}
            </MenuItem>

            <MenuDivider />

            {isStrict ? (
              <CirclePrivacyGroup
                title={t('CirclePrivacy.whoCanAssignMembers')}
                members={memberAssigners}
                orgOwners={orgOwners}
              />
            ) : (
              <>
                <CirclePrivacyGroup
                  title={t(
                    `CirclePrivacy.role${hasParentLinkMembers ? '' : '_members'}`,
                    { role: role.name }
                  )}
                  members={owners}
                  orgOwners={orgOwners}
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
                      members={leaders}
                      orgOwners={orgOwners}
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
