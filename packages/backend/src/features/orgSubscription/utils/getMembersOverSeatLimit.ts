import { Member_Role_Enum } from '../../../gql'

interface SeatMember {
  id: string
  role?: Member_Role_Enum | null
  createdAt: string
}

const rolePriority: Record<Member_Role_Enum, number> = {
  [Member_Role_Enum.Owner]: 0,
  [Member_Role_Enum.Admin]: 1,
  [Member_Role_Enum.Member]: 2,
  [Member_Role_Enum.Readonly]: 3,
}

// Returns the ids of the active members that exceed the seat limit.
// Kept first: Owners, then Admins, Members and Readonly, oldest first in each role.
export function getMembersOverSeatLimit(
  activeMembers: SeatMember[],
  seatLimit: number
): string[] {
  return [...activeMembers]
    .sort(
      (a, b) =>
        (a.role ? rolePriority[a.role] : 4) -
          (b.role ? rolePriority[b.role] : 4) ||
        a.createdAt.localeCompare(b.createdAt)
    )
    .slice(seatLimit)
    .map((member) => member.id)
}
