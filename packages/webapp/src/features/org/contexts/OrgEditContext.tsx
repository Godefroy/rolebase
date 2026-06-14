import { RoleFragment, RoleSummaryFragment } from '@gql'
import React, { ReactNode, createContext, useContext } from 'react'

// Every mutating operation the graph and the role panel need.
// Two implementations behind this interface:
//  - useDbOrgEditActions: hits the database + logs (org page, behavior unchanged)
//  - useDraftOrgEditActions: mutates an in-memory draft + appends logs (proposal editor)
export interface OrgEditActions {
  moveCircle(circleId: string, targetCircleId: string | null): Promise<void>
  copyCircle(
    circleId: string,
    targetCircleId: string | null
  ): Promise<string | undefined>
  archiveCircle(circleId: string): Promise<void>
  createCircle(
    parentId: string,
    roleOrName: RoleSummaryFragment | string
  ): Promise<string | undefined>
  updateRole(role: RoleFragment, values: Partial<RoleFragment>): Promise<void>
  addCircleMember(circleId: string, memberId: string): Promise<void>
  removeCircleMember(circleId: string, memberId: string): Promise<void>
  addCircleLink(parentId: string, circleId: string): Promise<void>
  removeCircleLink(parentId: string, circleId: string): Promise<void>
}

const OrgEditContext = createContext<OrgEditActions | undefined>(undefined)

interface Props {
  value: OrgEditActions
  children: ReactNode
}

export function OrgEditProvider({ value, children }: Props) {
  return (
    <OrgEditContext.Provider value={value}>{children}</OrgEditContext.Provider>
  )
}

export function useOrgEditActions(): OrgEditActions {
  const ctx = useContext(OrgEditContext)
  if (!ctx) {
    throw new Error('useOrgEditActions must be used within an OrgEditProvider')
  }
  return ctx
}
