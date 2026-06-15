import { useOrgContext } from '@/org/contexts/OrgContext'
import { Mentionable, MentionEntities } from '@rolebase/editor/react'

export default function useMentionables(): Mentionable[] {
  const members = useOrgContext().orgData?.members
  return (
    members?.map((member) => ({
      entity: MentionEntities.Member,
      id: member.id,
      name: member.name,
    })) || []
  )
}
