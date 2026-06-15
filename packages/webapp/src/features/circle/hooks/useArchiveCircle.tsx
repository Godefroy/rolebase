// Use this hook only in useDbOrgEditActions. Elsewhere, get the action from
// useOrgEditActions() so the active OrgContext implementation applies.
import useCreateLog from '@/log/hooks/useCreateLog'
import { useOrgContext } from '@/org/contexts/OrgContext'
import { useArchiveCirclesMutation } from '@gql'
import {
  EntitiesChanges,
  EntityChangeType,
  LogType,
} from '@rolebase/shared/model/log'
import { useCallback } from 'react'

// Archives circles and roles recursively (excluding base roles)
export default function useArchiveCircle() {
  const [archiveCircles] = useArchiveCirclesMutation()
  const createLog = useCreateLog()
  const { getOrgData } = useOrgContext()

  return useCallback(
    async (circleId: string) => {
      const orgData = getOrgData()
      if (!orgData) return

      const circle = orgData.circleById.get(circleId)
      if (!circle) return

      const children = orgData.descendantsOf(circleId)

      // Ids of all circles to archive
      const circlesIds = [circleId, ...children.map((c) => c.id)]

      // Ids of all roles to archive (excluding base roles)
      const rolesIds = [circle, ...children]
        .filter((c) => !orgData.roleById.get(c.roleId)?.base)
        .map((c) => c.roleId)

      // Prepare log changes
      const changes: EntitiesChanges = {
        circles: circlesIds.map((id) => ({
          type: EntityChangeType.Update,
          id,
          prevData: { archived: false },
          newData: { archived: true },
        })),
        roles: rolesIds.map((id) => ({
          type: EntityChangeType.Update,
          id,
          prevData: { archived: false },
          newData: { archived: true },
        })),
      }

      // Archive circles and roles
      await archiveCircles({
        variables: {
          circlesIds,
          rolesIds,
        },
      })

      // Log change
      createLog({
        display: {
          type: LogType.CircleArchive,
          id: circleId,
          name: orgData.roleById.get(circle.roleId)?.name || '',
        },
        changes,
      })
    },
    [getOrgData, archiveCircles, createLog]
  )
}
