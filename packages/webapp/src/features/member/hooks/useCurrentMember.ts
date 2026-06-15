import { useOrgContext } from '@/org/contexts/OrgContext'
import { useAuth } from '@/user/hooks/useAuth'
import useSuperAdmin from '@/user/hooks/useSuperAdmin'
import { MemberFragment } from '@gql'
import { useMemo } from 'react'

export default function useCurrentMember(): MemberFragment | undefined {
  const { user } = useAuth()
  const isSuperAdmin = useSuperAdmin()
  const { orgData, orgId } = useOrgContext()
  const members = orgData?.members

  return useMemo(() => {
    if (!user) return undefined

    const currentMember = members?.find((member) => member.userId === user.id)
    if (currentMember) return currentMember

    // Mock a member for super admin
    if (isSuperAdmin) {
      if (!orgId) return undefined
      return {
        id: '4d3e86c4-dba9-46c2-b016-ff084b9ec359',
        name: 'Superadmin',
        orgId: orgId,
        description: '',
        archived: false,
      } satisfies MemberFragment
    }
  }, [user?.id, members, isSuperAdmin, orgId])
}
