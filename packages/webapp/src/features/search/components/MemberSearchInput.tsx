import useOrgAdmin from '@/member/hooks/useOrgAdmin'
import { useOrgContext, useOrgEditActions } from '@/org/contexts/OrgContext'
import { MemberFragment } from '@gql'
import React from 'react'
import { useMemberSearchItems } from '../hooks/useMemberSearchItems'
import SearchInput, { SearchInputProps } from './SearchInput'

interface Props extends Omit<SearchInputProps, 'items'> {
  members?: MemberFragment[] // If not provided, use store
  excludeIds?: string[]
  allowCreate?: boolean
}

export default function MemberSearchInput({
  members,
  excludeIds,
  allowCreate,
  ...props
}: Props) {
  const items = useMemberSearchItems(members, excludeIds)
  const isAdmin = useOrgAdmin()
  const { isDraft } = useOrgContext()
  const { createMember } = useOrgEditActions()

  return (
    <SearchInput
      {...props}
      items={items}
      // Members are readonly in a proposal draft, so no creation there.
      onCreate={allowCreate && isAdmin && !isDraft ? createMember : undefined}
    />
  )
}
