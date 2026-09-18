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
  // List the members inside the roles. The members view is made of members, so
  // it is always on there.
  members: boolean
}

export const defaultGraphView: GraphView = {
  view: CirclesGraphViews.Circles,
  folded: false,
  members: true,
}

// Read a view from values coming from a URL, an embed or the database.
// An unknown view is left to the caller's default. The members view is never
// folded and always shows its members.
export function parseGraphView(
  view: string | null | undefined,
  folded?: boolean | null,
  members?: boolean | null
): GraphView | undefined {
  if (!view || !(view in CirclesGraphViews)) return undefined
  const parsed = view as CirclesGraphViews
  const isMembersView = parsed === CirclesGraphViews.Members
  return {
    view: parsed,
    folded: !isMembersView && !!folded,
    members: isMembersView || members !== false,
  }
}
