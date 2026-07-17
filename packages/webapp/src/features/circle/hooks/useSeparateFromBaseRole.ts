import useCreateLog from '@/log/hooks/useCreateLog'
import { useOrgContext } from '@/org/contexts/OrgContext'
import {
  RoleFragment,
  useCreateRoleMutation,
  useUpdateCircleMutation,
} from '@gql'
import { EntityChangeType, LogType } from '@rolebase/shared/model/log'
import { omit } from '@utils/omit'
import { useCallback } from 'react'

// Detach a circle from a shared base role by giving it its own independent copy
// (base: false) and repointing the circle to that new role. The base role and
// the other circles using it are left untouched.
export default function useSeparateFromBaseRole() {
  const [createRole] = useCreateRoleMutation()
  const [updateCircle] = useUpdateCircleMutation()
  const createLog = useCreateLog()
  const { orgId, getOrgData } = useOrgContext()

  return useCallback(
    async (circleId: string, baseRole: RoleFragment) => {
      if (!orgId) return
      const circle = getOrgData()?.getCircle(circleId)
      if (!circle) return
      const previousRoleId = circle.roleId

      // Create an independent copy of the base role (base: false), keeping its
      // full content.
      const { data: roleData, errors: roleErrors } = await createRole({
        variables: {
          values: {
            orgId,
            base: false,
            name: baseRole.name,
            purpose: baseRole.purpose,
            domain: baseRole.domain,
            accountabilities: baseRole.accountabilities,
            checklist: baseRole.checklist,
            indicators: baseRole.indicators,
            notes: baseRole.notes,
            singleMember: baseRole.singleMember,
            parentLink: baseRole.parentLink,
            colorHue: baseRole.colorHue,
          },
        },
      })
      const newRole = roleData?.insert_role_one
      if (roleErrors || !newRole) throw roleErrors?.[0]

      // Repoint the circle to its own role.
      const { data, errors } = await updateCircle({
        variables: { id: circleId, values: { roleId: newRole.id } },
      })
      if (errors || !data?.update_circle_by_pk) throw errors?.[0]

      // Log the change (undoable: archive the new role + restore the roleId).
      createLog({
        display: {
          type: LogType.RoleCreate,
          id: newRole.id,
          name: newRole.name,
        },
        changes: {
          roles: [
            {
              type: EntityChangeType.Create,
              id: newRole.id,
              data: omit(newRole, '__typename'),
            },
          ],
          circles: [
            {
              type: EntityChangeType.Update,
              id: circleId,
              prevData: { roleId: previousRoleId },
              newData: { roleId: newRole.id },
            },
          ],
        },
      })

      return newRole.id
    },
    [orgId, getOrgData, createRole, updateCircle, createLog]
  )
}
