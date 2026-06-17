import { useOrgContext, useOrgEditActions } from '@/org/contexts/OrgContext'
import { useNavigateOrg } from '@/org/hooks/useNavigateOrg'
import { Governance_Mode_Enum } from '@gql'
import { useToast } from '@chakra-ui/react'
import { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import useCurrentMember from '../../member/hooks/useCurrentMember'
import useOrgMember from '../../member/hooks/useOrgMember'
import useOrgOwner from '../../member/hooks/useOrgOwner'
import { GraphEvents } from '../types'

export default function useGraphEvents(): GraphEvents {
  const { t } = useTranslation()
  const toast = useToast()
  const isMember = useOrgMember()
  const isOrgOwner = useOrgOwner()
  const currentMember = useCurrentMember()
  const navigateOrg = useNavigateOrg()
  const { orgData, editable, governanceMode } = useOrgContext()
  const { moveCircle, copyCircle, addCircleMember, removeCircleMember } =
    useOrgEditActions()

  // Run a drag action, surfacing any error (e.g. a rejected mutation) as a
  // toast and reporting failure so the graph resets the drag.
  const runAction = useCallback(
    async (action: () => Promise<void>): Promise<boolean> => {
      try {
        await action()
        return true
      } catch (error: any) {
        toast({
          title: t('common.error'),
          description: error?.message || undefined,
          status: 'error',
          duration: 4000,
          isClosable: true,
        })
        return false
      }
    },
    [toast, t]
  )

  // Warn (and signal failure) when an action is refused, so the user knows why
  // the drag was reset.
  const warn = useCallback(
    (message: string) =>
      toast({
        title: message,
        status: 'warning',
        duration: 4000,
        isClosable: true,
      }),
    [toast]
  )

  // Per-circle permissions, the same rules as the panels and the Hasura
  // permissions, so drags never perform (or partially perform) an action the
  // server would reject.
  const getPerms = useCallback(
    (circleId: string) => {
      const circle = orgData?.getCircle(circleId)
      const role = circle && orgData?.getRole(circle.roleId)
      if (!orgData || !circle || !role || !editable) return undefined
      return orgData.getCirclePermissions(
        circle,
        role,
        currentMember?.id,
        governanceMode,
        isMember,
        isOrgOwner
      )
    },
    [orgData, editable, currentMember, governanceMode, isMember, isOrgOwner]
  )

  // Whether a sub-circle (parent-link or normal) may be added under a target
  // circle, or to the root (owner / Free only).
  const canAddSubCircleTo = useCallback(
    (targetCircleId: string | null, parentLink: boolean) => {
      if (!targetCircleId) {
        return (
          editable &&
          (isOrgOwner || governanceMode === Governance_Mode_Enum.Free)
        )
      }
      const perms = getPerms(targetCircleId)
      return parentLink
        ? !!perms?.canEditSubCirclesParentLinks
        : !!perms?.canEditSubCircles
    },
    [getPerms, editable, isOrgOwner, governanceMode]
  )

  // Why assigning a member to a target circle is refused, or undefined if it is
  // allowed: the assigner needs the right and a single-member role must have
  // room.
  const memberAddDenial = useCallback(
    (targetCircleId: string): string | undefined => {
      if (!getPerms(targetCircleId)?.canEditMembers) {
        return t('GraphActions.noPermission')
      }
      const circle = orgData?.getCircle(targetCircleId)
      const role = circle && orgData?.getRole(circle.roleId)
      if (
        role?.singleMember &&
        (orgData?.membersOf(targetCircleId).length ?? 0) >= 1
      ) {
        return t('GraphActions.singleMemberFull')
      }
      return undefined
    },
    [getPerms, orgData, t]
  )

  const roleOf = (circleId: string) =>
    orgData?.getRole(orgData.getCircle(circleId)?.roleId)

  // Navigation
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

  // Move a circle: requires editing the moved circle and adding it under the
  // target.
  const onCircleMove = useCallback(
    async (circleId: string, targetCircleId: string | null) => {
      if (
        !getPerms(circleId)?.canEditCircle ||
        !canAddSubCircleTo(targetCircleId, !!roleOf(circleId)?.parentLink)
      ) {
        warn(t('GraphActions.noPermission'))
        return false
      }
      return runAction(() => moveCircle(circleId, targetCircleId))
    },
    [getPerms, canAddSubCircleTo, orgData, moveCircle, runAction, warn, t]
  )

  // Copy a circle: requires adding it under the target (source is unchanged).
  const onCircleCopy = useCallback(
    async (circleId: string, targetCircleId: string | null) => {
      if (!canAddSubCircleTo(targetCircleId, !!roleOf(circleId)?.parentLink)) {
        warn(t('GraphActions.noPermission'))
        return undefined
      }
      try {
        return await copyCircle(circleId, targetCircleId)
      } catch (error: any) {
        toast({
          title: t('common.error'),
          description: error?.message || undefined,
          status: 'error',
          duration: 4000,
          isClosable: true,
        })
        return undefined
      }
    },
    [canAddSubCircleTo, orgData, copyCircle, toast, warn, t]
  )

  // Move a member: requires removing from the source AND adding to the target,
  // so the move never applies only partially.
  const onMemberMove = useCallback(
    async (
      memberId: string,
      parentCircleId: string,
      targetCircleId: string | null
    ) => {
      if (!getPerms(parentCircleId)?.canEditMembers) {
        warn(t('GraphActions.noPermission'))
        return false
      }
      if (targetCircleId) {
        const denial = memberAddDenial(targetCircleId)
        if (denial) {
          warn(denial)
          return false
        }
      }
      return runAction(async () => {
        if (targetCircleId) await addCircleMember(targetCircleId, memberId)
        await removeCircleMember(parentCircleId, memberId)
      })
    },
    [getPerms, memberAddDenial, addCircleMember, removeCircleMember, runAction, warn, t]
  )

  // Copy a member to a circle.
  const onMemberAdd = useCallback(
    async (memberId: string, targetCircleId: string) => {
      const denial = memberAddDenial(targetCircleId)
      if (denial) {
        warn(denial)
        return false
      }
      return runAction(() => addCircleMember(targetCircleId, memberId))
    },
    [memberAddDenial, addCircleMember, runAction, warn]
  )

  // Direct edits need an org member and an editable chart (preview/share
  // disable them). Per-action rights are then checked above.
  const canDrag = isMember && editable

  return useMemo(
    () => ({
      onCircleClick,
      onMemberClick,
      onClickOutside: () => navigateOrg('roles'),
      onCircleMove: canDrag ? onCircleMove : undefined,
      onCircleCopy: canDrag ? onCircleCopy : undefined,
      onMemberMove: canDrag ? onMemberMove : undefined,
      onMemberAdd: canDrag ? onMemberAdd : undefined,
    }),
    [
      canDrag,
      onCircleClick,
      onMemberClick,
      navigateOrg,
      onCircleMove,
      onCircleCopy,
      onMemberMove,
      onMemberAdd,
    ]
  )
}
