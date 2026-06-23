import { useOrgContext } from '@/org/contexts/OrgContext'
import { useStoreState } from '@store/hooks'
import { isOrgFresh } from '../isOrgFresh'

// True while an onboarding flow is in progress: a new user with no org yet
// (the wizard) or a freshly created org being set up (OrgSetupModal). Used to
// avoid showing other onboarding prompts (e.g. the book-a-demo modal) on top.
export default function useOnboardingActive(): boolean {
  const orgs = useStoreState((state) => state.orgs.entries)
  const { orgData } = useOrgContext()

  if (orgs && orgs.length === 0) return true
  return isOrgFresh(orgData)
}
