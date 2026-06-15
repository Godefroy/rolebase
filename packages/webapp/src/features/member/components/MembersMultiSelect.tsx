import CircleMemberLink from '@/circle/components/CircleMemberLink'
import { useOrgContext } from '@/org/contexts/OrgContext'
import { ButtonGroup, IconButton, ThemingProps, VStack } from '@chakra-ui/react'
import { truthy } from '@rolebase/shared/helpers/truthy'
import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { FiX } from 'react-icons/fi'
import { CreateIcon } from 'src/icons'
import MemberSearchButton from '../../search/components/MemberSearchButton'
import MemberButton from './MemberButton'

interface Props {
  circleId?: string // Used for member link
  membersIds: string[]
  excludeMembersIds?: string[]
  max?: number
  buttonProps?: ThemingProps<'Button'>
  onAdd?(memberId: string): void
  onRemove?(memberId: string): void
}

export default function MembersMultiSelect({
  circleId,
  membersIds,
  excludeMembersIds,
  max,
  buttonProps,
  onAdd,
  onRemove,
}: Props) {
  const { t } = useTranslation()
  const members = useOrgContext().orgData?.members
  const excludeMembersIdsMemo = useMemo(
    () =>
      excludeMembersIds ? membersIds.concat(excludeMembersIds) : membersIds,
    [membersIds, excludeMembersIds]
  )

  // Get selected members
  const selectedMembers = useMemo(
    () =>
      membersIds
        .map((id) => members?.find((m) => m.id === id))
        .filter(truthy)
        // Sort by name
        .sort((a, b) => a.name.localeCompare(b.name)),
    [membersIds, members]
  )

  return (
    <VStack spacing={2} alignItems="start">
      {selectedMembers.map((m) => (
        <CircleMemberLink
          key={m.id}
          memberId={m.id}
          circleId={circleId}
          tabIndex={-1}
        >
          <ButtonGroup variant="ghost" size="sm" isAttached>
            <MemberButton member={m} pr={1} />
            {onRemove && (
              <IconButton
                aria-label={t('common.remove')}
                icon={<FiX />}
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  onRemove(m.id)
                }}
              />
            )}
          </ButtonGroup>
        </CircleMemberLink>
      ))}

      {onAdd && (!max || selectedMembers.length < max) ? (
        <MemberSearchButton
          excludeIds={excludeMembersIdsMemo}
          size="sm"
          variant="outline"
          leftIcon={<CreateIcon size={20} />}
          onSelect={onAdd}
          {...buttonProps}
        >
          {max === 1
            ? t(`MembersMultiSelect.choose`)
            : t(`MembersMultiSelect.add`)}
        </MemberSearchButton>
      ) : null}
    </VStack>
  )
}
