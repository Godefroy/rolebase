// A main role being defined during onboarding, with the member responsible for
// it and any other members who take part in it.
export interface RoleDraft {
  id: string // local-only id
  name: string
  responsibleId?: string
  participantIds: string[]
}
