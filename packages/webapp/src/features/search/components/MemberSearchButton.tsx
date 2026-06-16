import useOrgAdmin from '@/member/hooks/useOrgAdmin'
import { useOrgContext, useOrgEditActions } from '@/org/contexts/OrgContext'
import { MemberFragment } from '@gql'
import React from 'react'
import { useMemberSearchItems } from '../hooks/useMemberSearchItems'
import SearchButton, { SearchButtonProps } from './SearchButton'

interface Props extends Omit<SearchButtonProps, 'items'> {
  members?: MemberFragment[] // If not provided, use store
  excludeIds?: string[]
}

export default function MemberSearchButton({
  members,
  excludeIds,
  ...props
}: Props) {
  const items = useMemberSearchItems(members, excludeIds)
  const isAdmin = useOrgAdmin()
  const { isDraft } = useOrgContext()
  const { createMember } = useOrgEditActions()

  return (
    <SearchButton
      {...props}
      items={items}
      // Members are readonly in a proposal draft, so no creation there.
      onCreate={isAdmin && !isDraft ? createMember : undefined}
    />
  )
}
