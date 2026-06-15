import useCurrentMember from '@/member/hooks/useCurrentMember'
import { useOrgContext } from '@/org/contexts/OrgContext'
import { MemberFragment } from '@gql'
import { SearchTypes } from '@rolebase/shared/model/search'
import { useMemo } from 'react'
import { SearchItem } from '../searchTypes'

export function useMemberSearchItems(
  members?: MemberFragment[], // If not provided, use store
  excludeIds?: string[]
): SearchItem[] {
  const currentMember = useCurrentMember()
  const membersInStore = useOrgContext().orgData?.members

  return useMemo(
    () =>
      ((members || membersInStore)
        ?.map((member): SearchItem | undefined => {
          // Exclude by id
          if (excludeIds?.includes(member.id)) return

          return {
            id: member.id,
            text: member.name.toLowerCase(),
            type: SearchTypes.Member,
            title: member.name,
            picture: member.picture || undefined,
          }
        })
        .filter(Boolean) as SearchItem[]) || [],
    [members, membersInStore, excludeIds, currentMember]
  )
}
