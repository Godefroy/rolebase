import { useAuth } from '@/user/hooks/useAuth'
import {
  Button,
  ButtonProps,
  Flex,
  Icon,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuItemOption,
  MenuList,
  MenuOptionGroup,
  Text,
  Tooltip,
  useDisclosure,
  useToast,
} from '@chakra-ui/react'
import { Member_Role_Enum, type MemberFragment } from '@gql'
import React, { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FiChevronDown, FiHelpCircle, FiX } from 'react-icons/fi'
import { trpc } from 'src/trpc'
import useOrgAdmin from '../hooks/useOrgAdmin'
import useOrgOwner from '../hooks/useOrgOwner'
import MemberInvitationModal from './MemberInvitationModal'
import MemberInviteModal from './MemberInviteModal'
import MemberRemoveAccessModal from './MemberRemoveAccessModal'

interface MemberOrgRoleSelectProps extends Omit<
  ButtonProps,
  'onClick' | 'isLoading'
> {
  member: MemberFragment
}

const ROLES: Member_Role_Enum[] = [
  Member_Role_Enum.Readonly,
  Member_Role_Enum.Member,
  Member_Role_Enum.Admin,
  Member_Role_Enum.Owner,
]

export default function MemberOrgRoleSelect({
  member,
  ...boxProps
}: MemberOrgRoleSelectProps) {
  const { t } = useTranslation()
  const toast = useToast()
  const [loading, setLoading] = useState(false)
  const inviteModal = useDisclosure()
  const invitationModal = useDisclosure()
  const removeAccessModal = useDisclosure()
  const { user } = useAuth()
  const isAdmin = useOrgAdmin()
  const isOwner = useOrgOwner()

  const currentRole = member.role || ''
  const isCurrentMember = user?.id === member.userId
  const isDisabled =
    !isAdmin ||
    (!isOwner && currentRole === Member_Role_Enum.Owner) ||
    isCurrentMember

  const canChangeRole = (newRole: Member_Role_Enum | '') => {
    return (
      !isCurrentMember &&
      currentRole !== newRole &&
      (isOwner || newRole !== Member_Role_Enum.Owner)
    )
  }
  const handleRoleChange = useCallback(
    async (newRole: Member_Role_Enum) => {
      if (newRole === currentRole) return

      setLoading(true)
      try {
        if (member.userId) {
          // Update role for existing user
          await trpc.member.updateMemberRole.mutate({
            memberId: member.id,
            role: newRole,
          })
          toast({
            title: t('MemberOrgRoleSelect.saved'),
            status: 'success',
            duration: 3000,
            isClosable: true,
          })
        }
      } catch (error: any) {
        toast({
          title: t('common.error'),
          description: error?.response?.data || error?.message || undefined,
          status: 'error',
        })
      }
      setLoading(false)
    },
    [member, currentRole, toast, t, removeAccessModal]
  )

  const hasPendingInvitation =
    currentRole && member.inviteDate && member.inviteEmail && !member.userId

  return (
    <>
      {!member.userId ? (
        !isAdmin ? null : hasPendingInvitation ? (
          <Button
            variant="outline"
            colorScheme="yellow"
            onClick={invitationModal.onOpen}
            {...boxProps}
          >
            {t('MemberOrgRoleSelect.viewPendingInvitation')}
          </Button>
        ) : (
          <Button
            variant="outline"
            colorScheme="green"
            onClick={inviteModal.onOpen}
            isLoading={loading}
            {...boxProps}
          >
            {t('MemberOrgRoleSelect.invite')}
          </Button>
        )
      ) : (
        <Menu>
          <MenuButton
            as={Button}
            rightIcon={isDisabled ? undefined : <FiChevronDown />}
            variant="link"
            isLoading={loading}
            isDisabled={isDisabled}
            {...boxProps}
          >
            {currentRole && t(`MemberOrgRoleSelect.roles.${currentRole}.title`)}
          </MenuButton>
          <MenuList zIndex={10} shadow="lg">
            <MenuOptionGroup
              type="radio"
              value={currentRole}
              title={t('MemberOrgRoleSelect.roles.title')}
              onChange={(value) => handleRoleChange(value as Member_Role_Enum)}
            >
              {ROLES.map((role) => (
                <MenuItemOption
                  key={role}
                  value={role}
                  isDisabled={!canChangeRole(role)}
                >
                  <Flex justify="space-between" align="center">
                    {t(`MemberOrgRoleSelect.roles.${role}.title`)}
                    <Tooltip
                      label={t(`MemberOrgRoleSelect.roles.${role}.description`)}
                      placement="left"
                    >
                      <span>
                        <Icon as={FiHelpCircle} ml={2} color="gray.500" />
                      </span>
                    </Tooltip>
                  </Flex>
                </MenuItemOption>
              ))}
            </MenuOptionGroup>
            <MenuDivider />
            <MenuItem
              isDisabled={!canChangeRole('')}
              onClick={removeAccessModal.onOpen}
            >
              <Icon as={FiX} mr={2} color="red.500" />
              <Text flex={1} color="red.500">
                {t('MemberOrgRoleSelect.removeAccess')}
              </Text>
            </MenuItem>
          </MenuList>
        </Menu>
      )}

      {inviteModal.isOpen && (
        <MemberInviteModal
          member={member}
          isOpen
          onClose={inviteModal.onClose}
        />
      )}

      {invitationModal.isOpen && member.inviteEmail && member.inviteDate && (
        <MemberInvitationModal
          member={member}
          isOpen
          onClose={invitationModal.onClose}
        />
      )}

      {removeAccessModal.isOpen && (
        <MemberRemoveAccessModal
          member={member}
          isOpen
          onClose={removeAccessModal.onClose}
        />
      )}
    </>
  )
}
