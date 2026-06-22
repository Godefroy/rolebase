import { Governance_Mode_Enum, type OrgDataFragment, type OrgFragment } from '@gql'
import {
  noopOrgEditActions,
  OrgContext,
  type OrgContextValue,
  type OrgEditActions,
  useOrgContext,
} from '@/org/contexts/OrgContext'
import useDraftOrgEditActions from '@/proposal/hooks/useDraftOrgEditActions'
import { CirclesGraphViews } from '@rolebase/graph'
import { useCallback, useMemo, useRef, type ReactNode } from 'react'
import {
  getDemoFragments,
  type DemoOrgKey,
  type DemoTexts,
} from '../../../demo/orgDemoData'
import useLiveDraft, { type LiveDraft } from '../../../demo/useLiveDraft'

const ORG_ID = 'demo-org'

// Computes the edit actions and re-provides the context with them. The webapp's
// draft action hook (structural edits: move/copy/create/update role, add/remove
// member & link) operates on the live draft; member-field edits are added on
// top (readonly in a real proposal draft, editable here).
function DemoActionsLayer({
  draft,
  children,
}: {
  draft: LiveDraft
  children: ReactNode
}) {
  const parent = useOrgContext()
  const structural = useDraftOrgEditActions(draft as never)

  const actions = useMemo<OrgEditActions>(
    () => ({
      ...structural,
      updateMember: (member, values) => draft.updateMember(member, values),
      createMember: (name) => draft.createMember(name),
      archiveMember: (memberId) => draft.archiveMember(memberId),
    }),
    [structural, draft]
  )

  const value = useMemo<OrgContextValue>(
    () => ({ ...parent, actions }),
    [parent, actions]
  )

  return <OrgContext.Provider value={value}>{children}</OrgContext.Provider>
}

interface Props {
  demo: DemoOrgKey
  texts: DemoTexts
  children: ReactNode
}

// Live, in-memory org provider for the demo. Behaves like the org page
// (everything editable, not a proposal draft) but backed by a static fixture
// instead of the database. All edits — structure, role text and member fields —
// run in memory through this provider's actions.
export default function DemoOrgProvider({ demo, texts, children }: Props) {
  const initial = useMemo(() => getDemoFragments(demo, texts), [demo, texts])
  const draft = useLiveDraft(initial)

  const dataRef = useRef(draft.orgData)
  dataRef.current = draft.orgData
  const getOrgData = useCallback(() => dataRef.current, [])
  const getOrgResult = draft.getData as unknown as () => OrgDataFragment

  const org = useMemo<OrgFragment>(
    () =>
      ({
        id: ORG_ID,
        name: 'Nova',
        archivedAt: null,
        createdAt: '2024-01-01T00:00:00.000Z',
        shareOrg: false,
        shareMembers: false,
        governanceMode: Governance_Mode_Enum.Free,
        defaultGraphView: CirclesGraphViews.AllCircles,
      }) as OrgFragment,
    []
  )

  const base = useMemo<OrgContextValue>(
    () => ({
      orgData: draft.orgData,
      roleOverlays: undefined,
      orgId: ORG_ID,
      org,
      subscription: undefined,
      governanceMode: Governance_Mode_Enum.Free,
      editable: true,
      isDraft: false,
      loading: false,
      error: undefined,
      ready: true,
      getOrgData,
      getOrgResult,
      actions: noopOrgEditActions,
    }),
    [draft.orgData, org, getOrgData, getOrgResult]
  )

  return (
    <OrgContext.Provider value={base}>
      <DemoActionsLayer draft={draft}>{children}</DemoActionsLayer>
    </OrgContext.Provider>
  )
}
