import {
  CircleFullFragment,
  MemberFragment,
  RoleFragment,
  RoleSummaryFragment,
} from '@gql'
import { useStoreState } from '@store/hooks'
import React, { ReactNode, createContext, useContext } from 'react'

export interface OrgData {
  circles: CircleFullFragment[] | undefined
  members: MemberFragment[] | undefined
  baseRoles: RoleSummaryFragment[] | undefined
  // Pending role-field edits, only in proposal draft mode (keyed by roleId).
  // The role panel still fetches the DB role via subscription and overlays
  // these draft changes on top. On the org page this is undefined.
  roleOverlays?: Record<string, Partial<RoleFragment>>
}

const OrgDataContext = createContext<OrgData | undefined>(undefined)

interface Props {
  value: OrgData
  children: ReactNode
}

export function OrgDataProvider({ value, children }: Props) {
  return (
    <OrgDataContext.Provider value={value}>{children}</OrgDataContext.Provider>
  )
}

// Read org data (circles, members, base roles) from the nearest provider, or
// from the Redux store by default. On the org page no provider is mounted, so
// this is equivalent to reading the store directly. In the proposal editor a
// provider supplies an in-memory draft instead.
export function useOrgData(): OrgData {
  const ctx = useContext(OrgDataContext)
  const storeCircles = useStoreState((state) => state.org.circles)
  const storeMembers = useStoreState((state) => state.org.members)
  const storeBaseRoles = useStoreState((state) => state.org.baseRoles)
  return (
    ctx ?? {
      circles: storeCircles,
      members: storeMembers,
      baseRoles: storeBaseRoles,
    }
  )
}
