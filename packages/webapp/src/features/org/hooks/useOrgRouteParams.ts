import { useMatch } from 'react-router'

// Derive the current org id or slug from the URL, so the org data provider can
// be mounted above the router (covering the sidebar and the org pages alike).
// A slug that doesn't match any org simply yields an empty subscription.
export function useOrgRouteParams(): { orgId?: string; slug?: string } {
  const orgMatch = useMatch('/orgs/:orgId/*')
  const slugMatch = useMatch('/:slug/*')
  const orgId = orgMatch?.params.orgId
  const slug = orgId ? undefined : slugMatch?.params.slug ?? undefined
  return { orgId, slug }
}
