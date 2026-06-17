import {
  Governance_Mode_Enum,
  MemberFragment,
  OrgDataFragment,
  OrgFragment,
  OrgSubscriptionFragment,
  RoleFragment,
  RoleSummaryFragment,
} from '@gql'
import { OrgData } from '@rolebase/shared/model/OrgData'
import { createContext, useContext } from 'react'

export type { OrgData }

// Every mutating operation the graph and the role panel need.
// Behind the OrgContext there are three implementations:
//  - DbOrgProvider: hits the database + logs (org page)
//  - DraftOrgProvider: mutates an in-memory draft + appends logs (proposal editor)
//  - ReadonlyOrgProvider: no-op (proposal preview, public share)
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
  // Edit a member's own fields (name, description…). Readonly in draft mode:
  // a proposal changes the org chart, not member profiles.
  updateMember(
    member: MemberFragment,
    values: Partial<MemberFragment>
  ): Promise<void>
  // Create a new member in the org and return its id. Readonly in draft mode.
  createMember(name: string): Promise<string | undefined>
  // Archive (delete) a member. Readonly in draft mode.
  archiveMember(memberId: string): Promise<void>
  // Restore an archived member. Backend only (org page).
  restoreMember(memberId: string): Promise<void>
  addCircleMember(circleId: string, memberId: string): Promise<void>
  removeCircleMember(circleId: string, memberId: string): Promise<void>
  addCircleLink(parentId: string, circleId: string): Promise<void>
  removeCircleLink(parentId: string, circleId: string): Promise<void>
}

// Pending role-field edits in proposal draft mode, keyed by roleId.
export type RoleOverlays = Record<string, Partial<RoleFragment>>

export interface OrgContextValue {
  // The single indexed org data object (circles, members, roles + lookups)
  orgData: OrgData | undefined
  roleOverlays: RoleOverlays | undefined
  orgId: string | undefined
  org: OrgFragment | undefined
  subscription: OrgSubscriptionFragment | undefined
  governanceMode: Governance_Mode_Enum
  // Whole org chart editable? false in readonly implementations (preview, share)
  editable: boolean
  // Backed by a real backend (org page). Member profile features that need it
  // (avatar upload, org-role management) are only available then, not in an
  // in-memory draft/demo.
  hasBackend?: boolean
  // In-memory proposal draft (not the live database). DB-only actions like
  // restoring an archived circle don't apply here.
  isDraft: boolean
  loading: boolean
  error: Error | undefined
  ready: boolean
  // Stable accessor of the latest org data (safe inside async callbacks, where
  // capturing `orgData` would go stale). For reactive reads, use `orgData`.
  getOrgData(): OrgData | undefined
  // Raw subscription result, used to seed an in-memory proposal draft
  getOrgResult(): OrgDataFragment | undefined
  actions: OrgEditActions
}

const noop = async (): Promise<any> => undefined

export const noopOrgEditActions: OrgEditActions = {
  moveCircle: noop,
  copyCircle: noop,
  archiveCircle: noop,
  createCircle: noop,
  updateRole: noop,
  updateMember: noop,
  createMember: noop,
  archiveMember: noop,
  restoreMember: noop,
  addCircleMember: noop,
  removeCircleMember: noop,
  addCircleLink: noop,
  removeCircleLink: noop,
}

const defaultValue: OrgContextValue = {
  orgData: undefined,
  roleOverlays: undefined,
  orgId: undefined,
  org: undefined,
  subscription: undefined,
  governanceMode: Governance_Mode_Enum.Free,
  editable: false,
  isDraft: false,
  loading: false,
  error: undefined,
  ready: false,
  getOrgData: () => undefined,
  getOrgResult: () => undefined,
  actions: noopOrgEditActions,
}

export const OrgContext = createContext<OrgContextValue>(defaultValue)

export function useOrgContext(): OrgContextValue {
  return useContext(OrgContext)
}

// The indexed org data of the nearest provider.
export function useOrgData(): OrgData | undefined {
  return useOrgContext().orgData
}

export function useOrgEditActions(): OrgEditActions {
  return useOrgContext().actions
}

