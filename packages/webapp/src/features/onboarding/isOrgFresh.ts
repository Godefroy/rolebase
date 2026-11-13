import { OrgFragment } from '@gql'
import { OrgData } from '@rolebase/shared/model/OrgData'

// An org whose setup steps are still to do: never set up (no model chosen,
// stored at the members step) and still bare, with only its root circle and no
// base role (orgs created before the setup existed). Used to drive the
// org-setup step (and to suppress other onboarding prompts while it runs).
export function isOrgFresh(
  org: OrgFragment | undefined,
  orgData: OrgData | undefined
): boolean {
  return (
    !!org &&
    !!orgData &&
    !org.onboardingOrgType &&
    orgData.circles.length === 1 &&
    !orgData.roles.some((role) => role.base)
  )
}
