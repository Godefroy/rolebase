import { OrgData } from '@rolebase/shared/model/OrgData'

// A freshly created org that hasn't been set up yet: only its root circle and
// no base role. Used to drive the org-setup step (and to suppress other
// onboarding prompts while it runs).
export function isOrgFresh(orgData: OrgData | undefined): boolean {
  return (
    !!orgData &&
    orgData.circles.length === 1 &&
    !orgData.roles.some((role) => role.base)
  )
}
