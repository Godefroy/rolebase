import useAddCircleLink from '@/circle/hooks/useAddCircleLink'
import useAddCircleMember from '@/circle/hooks/useAddCircleMember'
import useArchiveCircle from '@/circle/hooks/useArchiveCircle'
import useCreateCircle from '@/circle/hooks/useCreateCircle'
import useCopyCircle from '@/circle/hooks/useCopyCircle'
import useMoveCircle from '@/circle/hooks/useMoveCircle'
import useRemoveCircleLink from '@/circle/hooks/useRemoveCircleLink'
import useRemoveCircleMember from '@/circle/hooks/useRemoveCircleMember'
import useCreateMember from '@/member/hooks/useCreateMember'
import useUpdateRole from '@/role/hooks/useUpdateRole'
import { useUpdateMemberMutation } from '@gql'
import { useCallback, useMemo } from 'react'
import { trpc } from 'src/trpc'
import { OrgEditActions } from '../contexts/OrgContext'

// Database-backed implementation of OrgEditActions (org page).
// Each method wraps an existing hook: behavior is unchanged.
export default function useDbOrgEditActions(): OrgEditActions {
  const moveCircle = useMoveCircle()
  const copyCircle = useCopyCircle()
  const archiveCircle = useArchiveCircle()
  const createCircle = useCreateCircle()
  const updateRole = useUpdateRole()
  const addCircleMember = useAddCircleMember()
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

  return useMemo(
    () => ({
      moveCircle,
      copyCircle,
      archiveCircle,
      createCircle,
      updateRole,
      updateMember,
      createMember,
      archiveMember,
      addCircleMember,
      removeCircleMember,
      addCircleLink,
      removeCircleLink,
    }),
    [
      moveCircle,
      copyCircle,
      archiveCircle,
      createCircle,
      updateRole,
      updateMember,
      createMember,
      archiveMember,
      addCircleMember,
      removeCircleMember,
      addCircleLink,
      removeCircleLink,
    ]
  )
}
