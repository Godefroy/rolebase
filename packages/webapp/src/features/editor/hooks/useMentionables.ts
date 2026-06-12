import { Mentionable, MentionEntities } from '@rolebase/editor/react'
import { useStoreState } from '@store/hooks'

export default function useMentionables(): Mentionable[] {
  const members = useStoreState((state) => state.org.members)
  return (
    members?.map((member) => ({
      entity: MentionEntities.Member,
      id: member.id,
      name: member.name,
    })) || []
  )
}
