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
      // A row the Hasura filter rejects comes back as null without an error, so
      // check the result: logging an update that never happened would put a
      // phantom entry in the activity feed.
      const { data, errors } = await updateRole({
        variables: { id: role.id, values },
      })
      if (errors || !data?.update_role_by_pk) {
        throw errors?.[0] ?? new Error('Unauthorized')
      }

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
