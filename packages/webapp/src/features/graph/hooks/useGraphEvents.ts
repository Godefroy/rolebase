import { useOrgContext, useOrgEditActions } from '@/org/contexts/OrgContext'
import { useNavigateOrg } from '@/org/hooks/useNavigateOrg'
import { Governance_Mode_Enum } from '@gql'
import { useCallback, useMemo } from 'react'
import useOrgMember from '../../member/hooks/useOrgMember'
import { GraphEvents } from '../types'

export default function useGraphEvents(): GraphEvents {
  const isMember = useOrgMember()
  const navigateOrg = useNavigateOrg()
  const { editable, governanceMode } = useOrgContext()
  const { moveCircle, copyCircle, addCircleMember, removeCircleMember } =
    useOrgEditActions()

  // Direct org chart edits are disabled when the chart is read-only (preview,
  // share) and in Strict governance, where every change goes through proposals.
  const canEdit =
    isMember && editable && governanceMode !== Governance_Mode_Enum.Strict

  // Navigation Events
  const onCircleClick = useCallback(
    (circleId: string, parentId?: string) => {
      const params = new URLSearchParams()
      params.set('circleId', circleId)
      if (parentId) params.set('parentId', parentId)
      navigateOrg(`roles?${params.toString()}`)
    },
    [navigateOrg]
  )
  const onMemberClick = useCallback(
    (circleId: string, memberId: string) =>
      navigateOrg(`roles?circleId=${circleId}&memberId=${memberId}`),
    [navigateOrg]
  )

  // Move a circle member to another circle
  const onMemberMove = useCallback(
    async (
      memberId: string,
      parentCircleId: string,
      targetCircleId: string | null
    ) => {
      if (targetCircleId) {
        await addCircleMember(targetCircleId, memberId)
      }
      await removeCircleMember(parentCircleId, memberId)
    },
    [addCircleMember, removeCircleMember]
  )

  // Add a member to a circle
  const onMemberAdd = useCallback(
    (memberId: string, circleId: string) => addCircleMember(circleId, memberId),
    [addCircleMember]
  )

  return useMemo(
    () => ({
      onCircleClick,
      onMemberClick,
      onClickOutside: () => navigateOrg('roles'),
      onCircleMove: canEdit ? moveCircle : undefined,
      onCircleCopy: canEdit ? copyCircle : undefined,
      onMemberMove: canEdit ? onMemberMove : undefined,
      onMemberAdd: canEdit ? onMemberAdd : undefined,
    }),
    [
      canEdit,
      moveCircle,
      copyCircle,
      onMemberMove,
      onMemberAdd,
      navigateOrg,
      onCircleClick,
      onMemberClick,
    ]
  )
}
