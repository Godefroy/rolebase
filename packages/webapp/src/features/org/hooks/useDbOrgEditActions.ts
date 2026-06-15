import useAddCircleLink from '@/circle/hooks/useAddCircleLink'
import useAddCircleMember from '@/circle/hooks/useAddCircleMember'
import useArchiveCircle from '@/circle/hooks/useArchiveCircle'
import useCreateCircle from '@/circle/hooks/useCreateCircle'
import useCopyCircle from '@/circle/hooks/useCopyCircle'
import useMoveCircle from '@/circle/hooks/useMoveCircle'
import useRemoveCircleLink from '@/circle/hooks/useRemoveCircleLink'
import useRemoveCircleMember from '@/circle/hooks/useRemoveCircleMember'
import useUpdateRole from '@/role/hooks/useUpdateRole'
import { useMemo } from 'react'
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

  return useMemo(
    () => ({
      moveCircle,
      copyCircle,
      archiveCircle,
      createCircle,
      updateRole,
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
      addCircleMember,
      removeCircleMember,
      addCircleLink,
      removeCircleLink,
    ]
  )
}
