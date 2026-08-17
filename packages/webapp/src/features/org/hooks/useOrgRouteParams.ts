import { useMatch } from 'react-router'

// Derive the current org id or slug from the URL, so the org data provider can
// be mounted above the router (covering the sidebar and the org pages alike).
// A slug that doesn't match any org simply yields an empty subscription.
export function useOrgRouteParams(): { orgId?: string; slug?: string } {
  const orgMatch = useMatch('/orgs/:orgId/*')
  const slugMatch = useMatch('/:slug/*')
  // Anything else under /orgs (like the orgs list) is not an org id, and
  // sending it to Hasura would fail with a uuid syntax error
  const orgId = uuidRegex.test(orgMatch?.params.orgId ?? '')
    ? orgMatch?.params.orgId
    : undefined
  const slug = orgId ? undefined : slugMatch?.params.slug ?? undefined
  return { orgId, slug }
}

const uuidRegex =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
