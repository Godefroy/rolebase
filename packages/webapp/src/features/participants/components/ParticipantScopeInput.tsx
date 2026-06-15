import CircleMemberLink from '@/circle/components/CircleMemberLink'
import MemberByIdButton from '@/member/components/MemberByIdButton'
import { useOrgContext } from '@/org/contexts/OrgContext'
import CircleSearchButton from '@/search/components/CircleSearchButton'
import MemberSearchButton from '@/search/components/MemberSearchButton'
import { ButtonGroup, HStack, IconButton, VStack } from '@chakra-ui/react'
import { ParticipantsScope } from '@rolebase/shared/model/participants'
import React, { useCallback, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { FiX } from 'react-icons/fi'
import { CreateIcon } from 'src/icons'
import ParticipantsCircleScopeInput from './ParticipantsCircleScopeInput'

interface Props {
  participantsScope: ParticipantsScope
  onParticipantsScopeChange(scope: ParticipantsScope): void
  onInvitedMembersChange?(membersIds: string[]): void
}

export default function ParticipantScopeInput({
  participantsScope,
  onParticipantsScopeChange,
  onInvitedMembersChange,
}: Props) {
  const { t } = useTranslation()
  const { orgData } = useOrgContext()

  // Update invited members when scope changes
  const invitedMembersIds = useMemo(
    () => orgData?.getScopeMemberIds(participantsScope) ?? [],
    [orgData, participantsScope]
  )
  useEffect(() => {
    onInvitedMembersChange?.(invitedMembersIds)
  }, [invitedMembersIds])

  const handleAddCircle = useCallback(
    (circleId: string) => {
      onParticipantsScopeChange({
        ...participantsScope,
        circles: [
          ...participantsScope.circles,
          { id: circleId, children: false, excludeMembers: [] },
        ],
      })
    },
    [participantsScope]
  )

  const handleRemoveCircle = useCallback(
    (circleId: string) => {
      onParticipantsScopeChange({
        ...participantsScope,
        circles: participantsScope.circles.filter((c) => c.id !== circleId),
      })
    },
    [participantsScope]
  )

  const handleAddMember = useCallback(
    (memberId: string) => {
      onParticipantsScopeChange({
        ...participantsScope,
        members: [...participantsScope.members, memberId],
      })
    },
    [participantsScope]
  )

  const handleRemoveMember = useCallback(
    (memberId: string) => {
      onParticipantsScopeChange({
        ...participantsScope,
        members: participantsScope.members.filter((m) => m !== memberId),
      })
    },
    [participantsScope]
  )

  const handleToggleCircleChildren = useCallback(
    (circleId: string) => {
      onParticipantsScopeChange({
        ...participantsScope,
        circles: participantsScope.circles.map((c) =>
          c.id === circleId ? { ...c, children: !c.children } : c
        ),
      })
    },
    [participantsScope]
  )

  const handleToggleCircleMember = useCallback(
    (circleId: string, memberId: string) => {
      onParticipantsScopeChange({
        ...participantsScope,
        circles: participantsScope.circles.map((c) =>
          c.id === circleId
            ? {
                ...c,
                excludeMembers: c.excludeMembers.includes(memberId)
                  ? c.excludeMembers.filter((m) => m !== memberId)
                  : [...c.excludeMembers, memberId],
              }
            : c
        ),
      })
    },
    [participantsScope]
  )

  return (
    <VStack align="start">
      {participantsScope.circles.map((circleScope) => (
        <ParticipantsCircleScopeInput
          key={circleScope.id}
          circleScope={circleScope}
          onRemove={() => handleRemoveCircle(circleScope.id)}
          onToggleChildren={() => handleToggleCircleChildren(circleScope.id)}
          onToggleMember={(memberId: string) =>
            handleToggleCircleMember(circleScope.id, memberId)
          }
        />
      ))}

      {participantsScope.members.map((memberId) => (
        <CircleMemberLink key={memberId} memberId={memberId} tabIndex={-1}>
          <ButtonGroup variant="ghost" size="sm" isAttached>
            <MemberByIdButton id={memberId} pr={1} />
            <IconButton
              aria-label={t('common.remove')}
              icon={<FiX />}
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                handleRemoveMember(memberId)
              }}
            />
          </ButtonGroup>
        </CircleMemberLink>
      ))}

      <HStack mt={2}>
        <MemberSearchButton
          excludeIds={invitedMembersIds}
          size="sm"
          variant="outline"
          leftIcon={<CreateIcon size={20} />}
          onSelect={handleAddMember}
        >
          {t(`ParticipantScopeInput.addMember`)}
        </MemberSearchButton>

        <CircleSearchButton
          excludeIds={participantsScope.circles.map((c) => c.id)}
          size="sm"
          variant="outline"
          leftIcon={<CreateIcon size={20} />}
          onSelect={handleAddCircle}
        >
          {t(`ParticipantScopeInput.addCircle`)}
        </CircleSearchButton>
      </HStack>
    </VStack>
  )
}
