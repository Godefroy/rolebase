import { useOrgRole } from '@/member/hooks/useOrgRole'
import { useOrgContext } from '@/org/contexts/OrgContext'
import { Member_Role_Enum, useUpdateOrgMutation } from '@gql'
import { useEffect, useRef } from 'react'
import { track } from 'src/analytics'
import { isOrgFresh } from '../isOrgFresh'
import { OnboardingTodoStatus } from '../onboardingTodo'
import useOnboardingActivity from './useOnboardingActivity'

// Members with a photo needed to check the photos line
const PHOTOS_TO_CHECK = 2

export type OnboardingTodoItemKey =
  'orgChart' | 'invite' | 'recurringMeeting' | 'meeting' | 'thread' | 'photos'

// Onboarding todo of the current org: each line is derived from the org's real
// state, so it checks itself when the action is done elsewhere. Only the
// outcome (completed or dismissed) is stored, on org.onboardingTodo.
// Shown to owners and admins, the roles allowed to update the org in Hasura.
export default function useOnboardingTodo() {
  const { orgId, org, orgData } = useOrgContext()
  const role = useOrgRole()
  const [updateOrg] = useUpdateOrgMutation()

  const isAdmin =
    role === Member_Role_Enum.Owner || role === Member_Role_Enum.Admin
  const isOpen =
    !!org && org.onboardingTodo == null && !!orgData && !isOrgFresh(orgData)
  const visible = isAdmin && isOpen

  const activity = useOnboardingActivity(!visible)
  const members = orgData?.members ?? []

  const items: Record<OnboardingTodoItemKey, boolean> = {
    // Pre-checked: the setup just built it
    orgChart: true,
    invite:
      members.some((m) => !!m.inviteEmail) ||
      members.filter((m) => !!m.userId).length >= 2,
    // The setup only creates meeting templates: scheduling is left to the team
    recurringMeeting: activity.hasRecurringMeeting,
    meeting: activity.hasHeldMeeting,
    thread: activity.hasThread,
    // A couple of faces are enough to bring the org chart to life: a photo for
    // every member would be out of reach in a large team
    photos:
      members.length > 0 &&
      members.filter((m) => !!m.picture).length >=
        Math.min(PHOTOS_TO_CHECK, members.length),
  }
  const total = Object.keys(items).length
  const doneCount = Object.values(items).filter(Boolean).length

  const setStatus = (status: OnboardingTodoStatus) => {
    if (!orgId) return
    return updateOrg({
      variables: { id: orgId, values: { onboardingTodo: status } },
    })
  }

  // Completed once every line is checked: stored so the todo never comes back
  // if a line turns false later (a thread archived, a member removed)
  const completing = useRef(false)
  useEffect(() => {
    if (!visible || activity.loading || doneCount < total) return
    if (completing.current) return
    completing.current = true
    track('onboarding_todo_completed')
    setStatus(OnboardingTodoStatus.Completed)
  }, [visible, activity.loading, doneCount, total])

  const dismiss = () => {
    track('onboarding_todo_dismissed', { doneCount })
    setStatus(OnboardingTodoStatus.Dismissed)
  }

  return {
    visible,
    loading: activity.loading,
    items,
    doneCount,
    total,
    dismiss,
  }
}
