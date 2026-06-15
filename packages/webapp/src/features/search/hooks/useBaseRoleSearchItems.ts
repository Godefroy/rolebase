import useOrgBaseRoles from '@/org/hooks/useOrgBaseRoles'
import { RoleFragment } from '@gql'
import { truthy } from '@rolebase/shared/helpers/truthy'
import { SearchTypes } from '@rolebase/shared/model/search'
import { useMemo } from 'react'
import { SearchItem } from '../searchTypes'

export function useBaseRoleSearchItems(
  roles?: RoleFragment[],
  excludeIds?: string[],
  parentLink?: boolean
): SearchItem[] {
  const rolesInStore = useOrgBaseRoles()

  return useMemo(
    () =>
      (roles || rolesInStore)
        ?.map((role): SearchItem | undefined => {
          // Exclude by id
          if (excludeIds?.includes(role.id)) return

          // Exclude by parentLink property
          if (parentLink !== undefined && role.parentLink !== parentLink) {
            return
          }

          return {
            id: role.id,
            text: role.name.toLowerCase(),
            type: SearchTypes.Role,
            title: role.name,
          }
        })
        .filter(truthy) || [],
    [roles, rolesInStore, roles, excludeIds, parentLink]
  )
}
