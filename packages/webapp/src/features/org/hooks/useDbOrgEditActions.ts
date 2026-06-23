import useAddCircleLink from '@/circle/hooks/useAddCircleLink'
import useAddCircleMember from '@/circle/hooks/useAddCircleMember'
import useArchiveCircle from '@/circle/hooks/useArchiveCircle'
import useCreateCircle from '@/circle/hooks/useCreateCircle'
import useCopyCircle from '@/circle/hooks/useCopyCircle'
import useMoveCircle from '@/circle/hooks/useMoveCircle'
import useRemoveCircleLink from '@/circle/hooks/useRemoveCircleLink'
import useRemoveCircleMember from '@/circle/hooks/useRemoveCircleMember'
import useRestoreCircle from '@/circle/hooks/useRestoreCircle'
import useCreateMember from '@/member/hooks/useCreateMember'
import { useOrgContext } from '@/org/contexts/OrgContext'
import useUpdateRole from '@/role/hooks/useUpdateRole'
import { useCreateRoleMutation, useUpdateMemberMutation } from '@gql'
import { useCallback, useMemo } from 'react'
import { trpc } from 'src/trpc'
import { OrgEditActions } from '../contexts/OrgContext'

// Database-backed implementation of OrgEditActions (org page).
// Each method wraps an existing hook: behavior is unchanged.
export default function useDbOrgEditActions(): OrgEditActions {
  const { orgId } = useOrgContext()
  const moveCircle = useMoveCircle()
  const copyCircle = useCopyCircle()
  const archiveCircle = useArchiveCircle()
  const restoreCircle = useRestoreCircle()
  const createCircle = useCreateCircle()
  const updateRole = useUpdateRole()
  const addCircleMember = useAddCircleMember()

  const [createRoleMutation] = useCreateRoleMutation()
  const createRole = useCallback<OrgEditActions['createRole']>(
    async (values) => {
      if (!orgId) return
      const { data } = await createRoleMutation({
        variables: { values: { ...values, orgId } },
      })
      return data?.insert_role_one ?? undefined
    },
    [orgId, createRoleMutation]
  )
  const removeCircleMember = useRemoveCircleMember()
  const addCircleLink = useAddCircleLink()
  const removeCircleLink = useRemoveCircleLink()

  const [updateMemberMutation] = useUpdateMemberMutation()
  const updateMember = useCallback<OrgEditActions['updateMember']>(
    async (member, values) => {
      await updateMemberMutation({ variables: { id: member.id, values } })
    },
    [updateMemberMutation]
  )
  const createMember = useCreateMember()
  const archiveMember = useCallback<OrgEditActions['archiveMember']>(
    async (memberId) => {
      await trpc.member.archiveMember.mutate({ memberId })
    },
    []
  )
  const restoreMember = useCallback<OrgEditActions['restoreMember']>(
    async (memberId) => {
      await trpc.member.restoreMember.mutate({ memberId })
    },
    []
  )

  return useMemo(
    () => ({
      moveCircle,
      copyCircle,
      archiveCircle,
      restoreCircle,
      createCircle,
      createRole,
      updateRole,
      updateMember,
      createMember,
      archiveMember,
      restoreMember,
      addCircleMember,
      removeCircleMember,
      addCircleLink,
      removeCircleLink,
    }),
    [
      moveCircle,
      copyCircle,
      archiveCircle,
      restoreCircle,
      createCircle,
      createRole,
      updateRole,
      updateMember,
      createMember,
      archiveMember,
      restoreMember,
      addCircleMember,
      removeCircleMember,
      addCircleLink,
      removeCircleLink,
    ]
  )
}
