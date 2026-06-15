import { useOrgContext } from '@/org/contexts/OrgContext'
import {
  Button,
  Collapse,
  IconButton,
  Menu,
  MenuButton,
  MenuGroup,
  MenuList,
  Portal,
  Tooltip,
  useDisclosure,
} from '@chakra-ui/react'
import { Governance_Mode_Enum, MemberFragment, Member_Role_Enum } from '@gql'
import { ParticipantMember } from '@rolebase/shared/model/member'
import React, { useContext, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { ChevronDownIcon, ChevronUpIcon, PrivacyIcon } from 'src/icons'
import MemberMenuItem from '../../member/components/MemberMenuItem'
import { CircleContext } from '../contexts/CIrcleContext'
import CircleMemberLink from './CircleMemberLink'

export default function CirclePrivacy() {
  const { t } = useTranslation()
  const { governanceMode, orgData } = useOrgContext()

  // Get circle context
  const circleContext = useContext(CircleContext)
  if (!circleContext) return null
  const { role, owners, leaders, hasParentLinkMembers } = circleContext

  // Get organization's owners
  const members = orgData?.members
  const orgOwners = useMemo(
    () => members?.filter((m) => m.role === Member_Role_Enum.Owner),
    [members]
  )

  // The privacy menu is only relevant when governance is protected (not Free)
  if (governanceMode === Governance_Mode_Enum.Free) return null

  return (
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
          <MenuGroup
            title={t(
              `CirclePrivacy.role${hasParentLinkMembers ? '' : '_members'}`,
              { role: role.name }
            )}
          >
            {owners.map(({ member, circlesIds }) => (
              <CircleMemberLink
                key={member.id}
                memberId={member.id}
                circleId={circlesIds[0]}
              >
                <MemberMenuItem member={member} circlesIds={circlesIds} />
              </CircleMemberLink>
            ))}
            <OrgOwnersItems members={orgOwners} excludeParticipants={owners} />
          </MenuGroup>

          {!role.parentLink && !role.singleMember && (
            <MenuGroup
              title={t(
                `CirclePrivacy.subRoles${
                  hasParentLinkMembers ? '_members' : ''
                }`
              )}
              mt={5}
            >
              {leaders.map(({ member, circlesIds }) => (
                <CircleMemberLink
                  key={member.id}
                  memberId={member.id}
                  circleId={circlesIds[0]}
                >
                  <MemberMenuItem member={member} circlesIds={circlesIds} />
                </CircleMemberLink>
              ))}
              <OrgOwnersItems
                members={orgOwners}
                excludeParticipants={leaders}
              />
            </MenuGroup>
          )}
        </MenuList>
      </Portal>
    </Menu>
  )
}

interface OrgOwnersItemsProps {
  members?: MemberFragment[]
  excludeParticipants?: ParticipantMember[]
}

function OrgOwnersItems({ members, excludeParticipants }: OrgOwnersItemsProps) {
  const { t } = useTranslation()
  const expand = useDisclosure()

  const owners = useMemo(
    () =>
      members?.filter(
        (m) => !excludeParticipants?.find((p) => m.id === p.member.id)
      ),
    [members, excludeParticipants]
  )
  if (!owners?.length) return null

  return (
    <>
      <Button
        rightIcon={
          expand.isOpen ? (
            <ChevronUpIcon size="1em" />
          ) : (
            <ChevronDownIcon size="1em" />
          )
        }
        size="sm"
        variant="ghost"
        w="100%"
        fontWeight="normal"
        onClick={expand.onToggle}
      >
        {t('CirclePrivacy.ownersShowMore', { count: owners.length })}
      </Button>
      <Collapse in={expand.isOpen} animateOpacity>
        {owners?.map((member) => (
          <CircleMemberLink key={member.id} memberId={member.id}>
            <MemberMenuItem
              member={member}
              description={t('CirclePrivacy.roleOwner')}
            />
          </CircleMemberLink>
        ))}
      </Collapse>
    </>
  )
}
