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

// In-memory org data for the proposal editor. Governance is forced to Agile so
// the current member can prepare changes (they are treated as a leader of the
// thread's circle, baked into the draft's OrgData). Org identity (name, id,
// subscription) is forwarded from the parent DbOrgProvider.
export default function DraftOrgProvider({ draft, children }: Props) {
  const parent = useOrgContext()
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
      governanceMode: Governance_Mode_Enum.Agile,
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
      parent.orgId,
      parent.org,
      parent.subscription,
      actions,
      getOrgData,
    ]
  )

  return <OrgContext.Provider value={value}>{children}</OrgContext.Provider>
}
