import { Governance_Mode_Enum } from '@gql'
import useDraftOrgEditActions from '@/proposal/hooks/useDraftOrgEditActions'
import { ProposalDraft } from '@/proposal/hooks/useProposalDraft'
import { OrgData } from '@rolebase/shared/model/OrgData'
import React, { ReactNode, useCallback, useMemo, useRef } from 'react'
import {
  OrgContext,
  OrgContextValue,
  useOrgContext,
} from './OrgContext'

interface Props {
  draft: ProposalDraft
  children: ReactNode
}

// In-memory org data for the proposal editor. The current member prepares
// changes as a leader of the thread's circle (baked into the draft's OrgData),
// so Strict governance is relaxed to Agile while Free keeps its open edit
// rights. Org identity (name, id, subscription) is forwarded from the parent
// DbOrgProvider. Must stay in sync with the OrgData governanceMode set in
// useProposalDraft.
export default function DraftOrgProvider({ draft, children }: Props) {
  const parent = useOrgContext()
  const governanceMode =
    parent.governanceMode === Governance_Mode_Enum.Free
      ? Governance_Mode_Enum.Free
      : Governance_Mode_Enum.Agile
  const actions = useDraftOrgEditActions(draft)

  const dataRef = useRef<OrgData | undefined>(undefined)
  dataRef.current = draft.orgData
  const getOrgData = useCallback(() => dataRef.current, [])

  const value = useMemo<OrgContextValue>(
    () => ({
      orgData: draft.orgData,
      roleOverlays: draft.roleOverlays,
      orgId: parent.orgId,
      org: parent.org,
      subscription: parent.subscription,
      governanceMode,
      editable: true,
      isDraft: true,
      loading: !draft.ready,
      error: undefined,
      ready: draft.ready,
      getOrgData,
      getOrgResult: draft.getData,
      actions,
    }),
    [
      draft.orgData,
      draft.roleOverlays,
      draft.ready,
      draft.getData,
      governanceMode,
      parent.orgId,
      parent.org,
      parent.subscription,
      actions,
      getOrgData,
    ]
  )

  return <OrgContext.Provider value={value}>{children}</OrgContext.Provider>
}
