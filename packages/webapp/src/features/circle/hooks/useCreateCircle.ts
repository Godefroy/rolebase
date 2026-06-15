// Use this hook only in useDbOrgEditActions. Elsewhere, get the action from
// useOrgEditActions() so the active OrgContext implementation applies.
import useCreateLog from '@/log/hooks/useCreateLog'
import { useOrgContext } from '@/org/contexts/OrgContext'
import {
  RoleFragment,
  RoleSummaryFragment,
  useCreateCircleMutation,
  useCreateRoleMutation,
} from '@gql'
import { EntitiesChanges, EntityChangeType, LogType } from '@rolebase/shared/model/log'
import { omit } from '@utils/omit'
import { useCallback } from 'react'

// Create a circle (and its role if a name is given) under a parent circle.
// Returns the new circle id.
export default function useCreateCircle() {
  const [createCircle] = useCreateCircleMutation()
  const [createRole] = useCreateRoleMutation()
  const createLog = useCreateLog()
  const { orgId, getOrgData } = useOrgContext()

  return useCallback(
    async (
      parentId: string,
      roleOrName: RoleSummaryFragment | string
    ): Promise<string | undefined> => {
      if (!orgId) return

      // Create role if a name is given
      let role: RoleFragment | RoleSummaryFragment
      if (typeof roleOrName === 'string') {
        const { data } = await createRole({
          variables: { values: { orgId, name: roleOrName } },
        })
        role = data?.insert_role_one!
      } else {
        role = roleOrName
      }

      // Create circle
      const { data } = await createCircle({
        variables: { orgId, roleId: role.id, parentId },
      })
      const newCircle = data?.insert_circle_one!

      // Build changes
      const changes: EntitiesChanges = {
        circles: [
          {
            type: EntityChangeType.Create,
            id: newCircle.id,
            data: { ...omit(newCircle, '__typename') },
          },
        ],
      }
      if (typeof roleOrName === 'string') {
        changes.roles = [
          {
            type: EntityChangeType.Create,
            id: role.id,
            data: role as RoleFragment,
          },
        ]
      }

      // Log change
      const orgData = getOrgData()
      const parentCircle = orgData?.getCircle(parentId)
      createLog({
        display: {
          type: LogType.CircleCreate,
          id: newCircle.id,
          name: role.name,
          parentId,
          parentName: orgData?.getRole(parentCircle?.roleId)?.name || null,
        },
        changes,
      })

      return newCircle.id
    },
    [orgId]
  )
}
