import { useOrgContext } from '@/org/contexts/OrgContext'
import { useCreateMemberMutation } from '@gql'
import { useCallback } from 'react'

export default function useCreateMember() {
  const { orgId } = useOrgContext()
  const [createMember] = useCreateMemberMutation()

  return useCallback(
    async (name: string) => {
      if (!orgId) throw new Error()

      // Create member
      const memberResult = await createMember({ variables: { orgId, name } })
      const member = memberResult.data?.insert_member_one
      if (!member) throw new Error('Error while creating member')

      return member.id
    },
    [orgId, createMember]
  )
}
