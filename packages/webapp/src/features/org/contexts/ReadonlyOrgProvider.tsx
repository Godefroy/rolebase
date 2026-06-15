import {
  Governance_Mode_Enum,
  OrgFragment,
  OrgSubscriptionFragment,
} from '@gql'
import { OrgData } from '@rolebase/shared/model/OrgData'
import React, { ReactNode, useCallback, useMemo, useRef } from 'react'
import {
  noopOrgEditActions,
  OrgContext,
  OrgContextValue,
  RoleOverlays,
} from './OrgContext'

interface Props {
  orgData: OrgData | undefined
  roleOverlays?: RoleOverlays
  org?: OrgFragment
  orgId?: string
  subscription?: OrgSubscriptionFragment
  governanceMode?: Governance_Mode_Enum
  children: ReactNode
}

// Read-only org data from a fixed snapshot (proposal preview, public share).
// The whole org chart is not editable and actions are no-ops.
export default function ReadonlyOrgProvider({
  orgData,
  roleOverlays,
  org,
  orgId,
  subscription,
  governanceMode = Governance_Mode_Enum.Free,
  children,
}: Props) {
  const dataRef = useRef<OrgData | undefined>(undefined)
  dataRef.current = orgData
  const getOrgData = useCallback(() => dataRef.current, [])

  const value = useMemo<OrgContextValue>(
    () => ({
      orgData,
      roleOverlays,
      orgId,
      org,
      subscription,
      governanceMode,
      editable: false,
      isDraft: false,
      loading: false,
      error: undefined,
      ready: !!orgData,
      getOrgData,
      getOrgResult: () => undefined,
      actions: noopOrgEditActions,
    }),
    [orgData, roleOverlays, org, orgId, subscription, governanceMode, getOrgData]
  )

  return <OrgContext.Provider value={value}>{children}</OrgContext.Provider>
}
