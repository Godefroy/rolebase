import CircleBreadcrumbButton from '@/circle/components/CircleBreadcrumbButton'
import { CircleContext } from '@/circle/contexts/CIrcleContext'
import { CircleMemberContext } from '@/circle/contexts/CircleMemberContext'
import { useOrgContext } from '@/org/contexts/OrgContext'
import { Flex, IconButton, Tooltip } from '@chakra-ui/react'
import { CircleFragment } from '@gql'
import { Eye } from 'iconsax-react'
import React, { useContext, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { FiX } from 'react-icons/fi'

interface Props {
  memberId: string
  circle: CircleFragment
  hideActions?: boolean
  onDelete?(): void
  onFocus?(): void
}

export default function MemberRoleItem({
  memberId,
  circle,
  hideActions,
  onDelete,
  onFocus,
}: Props) {
  const { t } = useTranslation()
  const { orgData } = useOrgContext()
  const circleContext = useContext(CircleContext)
  const circleMemberContext = useContext(CircleMemberContext)
  const canFocus = circleMemberContext?.canFocus
  const roleName = orgData?.getRole(circle.roleId)?.name ?? ''

  // Circle member data
  const circleMember = useMemo(
    () =>
      orgData
        ? orgData
            .membersOf(circle.id)
            .find((m) => m.member.id === memberId)
        : undefined,
    [memberId, circle, orgData]
  )

  if (!circleMember) return null

  return (
    <Flex alignItems="center">
      <CircleBreadcrumbButton circle={circle} flex={1} />

      {canFocus && !hideActions && (
        <Tooltip
          label={t('MemberRoleItem.focusTooltip', {
            role: roleName,
          })}
          placement="top"
          hasArrow
        >
          <IconButton
            aria-label={''}
            icon={<Eye size={18} />}
            variant="ghost"
            size="sm"
            onClick={onFocus}
          />
        </Tooltip>
      )}

      {circleContext?.canEditMembers && !hideActions && (
        <Tooltip
          label={t('MemberRoleItem.removeTooltip', {
            member: circleMember.member.name,
            role: roleName,
          })}
          placement="top"
          hasArrow
        >
          <IconButton
            aria-label={t('common.remove')}
            icon={<FiX />}
            variant="ghost"
            size="sm"
            onClick={onDelete}
          />
        </Tooltip>
      )}
    </Flex>
  )
}
