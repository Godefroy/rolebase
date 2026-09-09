// How the org chart draws the organization.
// Each view can be folded around the selected role: only that role, its
// ancestors and their direct roles are drawn, instead of the whole org.
export enum CirclesGraphViews {
  Circles = 'Circles',
  Tree = 'Tree',
  Members = 'Members',
}

export interface GraphView {
  view: CirclesGraphViews
  folded: boolean
}

export const defaultGraphView: GraphView = {
  view: CirclesGraphViews.Circles,
  folded: false,
}

// Read a view from values coming from a URL, an embed or the database.
// An unknown view is left to the caller's default. The members view is never
// folded.
export function parseGraphView(
  view: string | null | undefined,
  folded?: boolean | null
): GraphView | undefined {
  if (!view || !(view in CirclesGraphViews)) return undefined
  const parsed = view as CirclesGraphViews
  return {
    view: parsed,
    folded: parsed !== CirclesGraphViews.Members && !!folded,
  }
}
