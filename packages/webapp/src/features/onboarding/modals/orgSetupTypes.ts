// A main role being defined during onboarding, with the member responsible for
// it and any other members who take part in it.
export interface RoleDraft {
  id: string // local-only id
  name: string
  // The model's leader base role in the root circle, instead of a new main
  // role: the responsible holds it and there are no other participants
  isLeaderBaseRole?: boolean
  responsibleId?: string
  participantIds: string[]
}
