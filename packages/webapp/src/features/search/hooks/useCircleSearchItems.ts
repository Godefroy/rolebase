import { useOrgContext } from '@/org/contexts/OrgContext'
import { CircleFragment } from '@gql'
import { truthy } from '@rolebase/shared/helpers/truthy'
import { SearchTypes } from '@rolebase/shared/model/search'
import { useMemo } from 'react'
import { searchItemTitleSeparator } from '../components/SearchResultItem'
import { SearchItem } from '../searchTypes'

export function useCircleSearchItems(
  circles?: CircleFragment[],
  excludeIds?: string[],
  singleMember?: boolean
): SearchItem[] {
  const { orgData } = useOrgContext()
  const circlesInStore = orgData?.circles

  return useMemo(
    () =>
      (circlesInStore && (circles || circlesInStore))
        ?.map((circle): SearchItem | undefined => {
          // Exclude by id
          if (excludeIds?.includes(circle.id)) return

          // Get roles and ancestors
          const circleFull = orgData?.andParentsOf(circle.id) ?? []
          const role = orgData?.getRole(circleFull[circleFull.length - 1]?.roleId)

          // Exclude by singleMember property
          if (
            !role ||
            (singleMember !== undefined &&
              (role.singleMember || false) !== singleMember)
          ) {
            return
          }

          return {
            id: circle.id,
            text: role.name.toLowerCase(),
            type: SearchTypes.Circle,
            title: circleFull
              .map((cr) => orgData?.getRole(cr.roleId)?.name)
              .join(searchItemTitleSeparator),
          }
        })
        .filter(truthy) || [],
    [circles, circlesInStore, excludeIds, singleMember, orgData]
  )
}
