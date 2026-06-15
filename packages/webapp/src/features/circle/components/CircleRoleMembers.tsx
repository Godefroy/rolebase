import { GraphContext } from '@/graph/contexts/GraphContext'
import { useOrgContext, useOrgEditActions } from '@/org/contexts/OrgContext'
import { Box, Heading, useDisclosure } from '@chakra-ui/react'
import React, { useCallback, useContext, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import MembersMultiSelect from '../../member/components/MembersMultiSelect'
import { CircleContext } from '../contexts/CIrcleContext'
import CircleMemberDeleteModal from '../modals/CircleMemberDeleteModal'

export default function CircleRoleMembers() {
  const { t } = useTranslation()
  const graphContext = useContext(GraphContext)
  const { orgData } = useOrgContext()

  // Get circle context
  const circleContext = useContext(CircleContext)
  if (!circleContext) return null
  const { circle, role, participants, canEditMembers } = circleContext

  // Direct circle members ids
  const membersIds = useMemo(
    () =>
      orgData
        ? orgData.membersOf(circle.id).map((cm) => cm.member.id)
        : [],
    [orgData, circle]
  )

  const highlightButton = membersIds.length === 0 && participants.length === 0

  const { addCircleMember } = useOrgEditActions()
  const handleAddMember = useCallback(
    async (memberId: string) => {
      await addCircleMember(circle.id, memberId)
      // Focus circle in graph
      graphContext?.graph?.focusNodeIdAfterData(circle.id, true)
    },
    [circle.id, circle]
  )

  const handleRemoveMember = useCallback((memberId: string) => {
    setMemberId(memberId)
    onDeleteOpen()
  }, [])

  // CircleMemberDeleteModal
  const [memberId, setMemberId] = useState<string | undefined>()
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure()

  // Hide if read only and empty
  if (!canEditMembers && !membersIds?.length) return null

  return (
    <Box>
      <Heading as="h3" size="sm" mb={3}>
        {role?.singleMember
          ? t('CircleRoleMembers.labelSingleMember')
          : t('CircleRoleMembers.labelMultiMembers')}
      </Heading>

      {circle && membersIds && (
        <MembersMultiSelect
          circleId={circle.id}
          membersIds={membersIds}
          max={role?.singleMember ? 1 : undefined}
          buttonProps={
            highlightButton
              ? { variant: 'solid', colorScheme: 'blue' }
              : undefined
          }
          onAdd={canEditMembers ? handleAddMember : undefined}
          onRemove={canEditMembers ? handleRemoveMember : undefined}
        />
      )}
      {isDeleteOpen && memberId && (
        <CircleMemberDeleteModal
          memberId={memberId}
          circleId={circle.id}
          isOpen
          onClose={onDeleteClose}
        />
      )}
    </Box>
  )
}
