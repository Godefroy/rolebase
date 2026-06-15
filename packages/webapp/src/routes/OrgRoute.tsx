import React from 'react'
import OrgRouteContent from './OrgRouteContent'

// Org data is provided higher up by DbOrgProvider (in LoggedLayout), derived
// from the URL. This route just renders the org pages.
export default function OrgRoute() {
  return <OrgRouteContent />
}
