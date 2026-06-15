// Use this hook only in useDbOrgEditActions. Elsewhere, get the action from
// useOrgEditActions() so the active OrgContext implementation applies.
import useCreateLog from '@/log/hooks/useCreateLog'
import { useOrgContext } from '@/org/contexts/OrgContext'
import { useUpdateCircleMutation } from '@gql'
import { EntityChangeType, LogType } from '@rolebase/shared/model/log'
import { useCallback } from 'react'

export default function useMoveCircle() {
  const [updateCircle] = useUpdateCircleMutation()
  const createLog = useCreateLog()
  const { getOrgData } = useOrgContext()

  return useCallback(
    async (circleId: string, targetCircleId: string | null) => {
      const { data, errors } = await updateCircle({
        variables: { id: circleId, values: { parentId: targetCircleId } },
      })
      const result = data?.update_circle_by_pk
      if (errors || !result) throw errors?.[0]

      // Log changes
      const circle = getOrgData()?.getCircle(circleId)
      if (!circle) return
      createLog({
        display: {
          type: LogType.CircleMove,
          id: circleId,
          name: result.role.name,
          parentId: targetCircleId,
          parentName: result?.parent?.role?.name || null,
        },
        changes: {
          circles: [
            {
              type: EntityChangeType.Update,
              id: circleId,
              prevData: { parentId: circle.parentId },
              newData: { parentId: targetCircleId },
            },
          ],
        },
      })
    },
    []
  )
}
