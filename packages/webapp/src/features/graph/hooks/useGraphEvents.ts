import { useOrgEditActions } from '@/org/contexts/OrgEditContext'
import { useNavigateOrg } from '@/org/hooks/useNavigateOrg'
import { useCallback, useMemo } from 'react'
import useOrgMember from '../../member/hooks/useOrgMember'
import { GraphEvents } from '../types'

export default function useGraphEvents(): GraphEvents {
  const isMember = useOrgMember()
  const navigateOrg = useNavigateOrg()
  const { moveCircle, copyCircle, addCircleMember, removeCircleMember } =
    useOrgEditActions()

  // Navigation Events
  const onCircleClick = useCallback((circleId: string, parentId?: string) => {
    const params = new URLSearchParams()
    params.set('circleId', circleId)
    if (parentId) params.set('parentId', parentId)
    navigateOrg(`roles?${params.toString()}`)
  }, [])
  const onMemberClick = useCallback(
    (circleId: string, memberId: string) =>
      navigateOrg(`roles?circleId=${circleId}&memberId=${memberId}`),
    []
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
      onCircleMove: isMember ? moveCircle : undefined,
      onCircleCopy: isMember ? copyCircle : undefined,
      onMemberMove: isMember ? onMemberMove : undefined,
      onMemberAdd: isMember ? onMemberAdd : undefined,
    }),
    [isMember, moveCircle, copyCircle, onMemberMove, onMemberAdd]
  )
}
