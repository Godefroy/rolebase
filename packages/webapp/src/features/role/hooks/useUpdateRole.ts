// Use this hook only in useDbOrgEditActions. Elsewhere, get the action from
// useOrgEditActions() so the active OrgContext implementation applies.
import useCreateLog from '@/log/hooks/useCreateLog'
import { RoleFragment, useUpdateRoleMutation } from '@gql'
import { getEntityChanges } from '@rolebase/shared/helpers/log/getEntityChanges'
import { EntityChangeType, LogType } from '@rolebase/shared/model/log'
import { useCallback } from 'react'

// Update a role's fields and log the change.
export default function useUpdateRole() {
  const [updateRole] = useUpdateRoleMutation()
  const createLog = useCreateLog()

  return useCallback(
    async (role: RoleFragment, values: Partial<RoleFragment>) => {
      await updateRole({ variables: { id: role.id, values } })

      // Log change (diff prev/new)
      const { prevData, newData } = getEntityChanges(role, values)
      createLog({
        display: {
          type: LogType.RoleUpdate,
          id: role.id,
          name: role.name,
        },
        changes: {
          roles: [
            {
              type: EntityChangeType.Update,
              id: role.id,
              prevData,
              newData,
            },
          ],
        },
      })
    },
    []
  )
}
