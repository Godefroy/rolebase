import { useOrgContext } from '@/org/contexts/OrgContext'
import { useMemo, useState } from 'react'
import { track } from 'src/analytics'
import useOrgChartTourStatus from './useOrgChartTourStatus'

// Steps of the org chart tour, in order. Each one is done by the real gesture
// in the org chart, never by a "next" button. The last one stays until the
// person ends the tour or goes further.
export const orgChartTourSteps = [
  'openOrg',
  'addRole',
  'openRole',
  'assignMember',
  'placeEveryone',
] as const

// Optional chapter offered at the end: how a team is led and represented, and
// who takes part in a role. Explanations only, read at the person's pace.
export const orgChartTourMoreSteps = [
  'leader',
  'representative',
  'participants',
] as const

export type OrgChartTourStep = (typeof orgChartTourSteps)[number]
export type OrgChartTourMoreStep = (typeof orgChartTourMoreSteps)[number]

// Org chart tour, shown after the org setup: it teaches to create a role and
// give it to a member, in the org chart itself. The step is derived from the
// org's real state and the open panel, so the tour resumes where it was after
// a reload and follows whatever the person does on their own. Only its start
// and end are stored (useOrgChartTourStatus).
export default function useOrgChartTour(selectedCircleId?: string) {
  const { orgData } = useOrgContext()
  const { status, setStatus } = useOrgChartTourStatus()
  const [moreIndex, setMoreIndex] = useState(0)
  // Furthest explanation read, to come back to after going back
  const [moreReached, setMoreReached] = useState(0)

  const state = useMemo(() => {
    if (!orgData) return
    const rootCircle = orgData.circles.find((c) => !c.parentId)
    if (!rootCircle) return

    const roleCircles = orgData.circles.filter((c) => c.id !== rootCircle.id)
    const placedIds = new Set(
      orgData.circles.flatMap((c) =>
        orgData.membersOf(c.id).map(({ member }) => member.id)
      )
    )
    const unplacedMembers = orgData.members.filter((m) => !placedIds.has(m.id))
    const selectedRole = roleCircles.find((c) => c.id === selectedCircleId)
    // The role to open: the last one created (circles come in creation order)
    const newRole = roleCircles[roleCircles.length - 1]

    let step: OrgChartTourStep
    if (placedIds.size > 0) {
      step = 'placeEveryone'
    } else if (roleCircles.length === 0) {
      step = selectedCircleId === rootCircle.id ? 'addRole' : 'openOrg'
    } else {
      step = selectedRole ? 'assignMember' : 'openRole'
    }

    // Role the tour points at: the open one, else the last created
    const role = selectedRole ?? newRole

    // The model's roles representing a team in its parent, seeded with the
    // org: its leader (Manager, Leader, Lead Link...) first, then its
    // representative, told apart by their seeded colors
    const [leaderRole, representativeRole] = orgData.roles
      .filter((r) => r.base && r.parentLink)
      .sort((a, b) => (a.colorHue ?? 0) - (b.colorHue ?? 0))

    return {
      step,
      rootCircle,
      role,
      roleName: role && orgData.getRole(role.roleId)?.name,
      unplacedMembers,
      leaderRole,
      representativeRole,
    }
  }, [orgData, selectedCircleId])

  const startMore = () => {
    track('org_tour_more_started')
    setMoreIndex(0)
    setMoreReached(0)
    return setStatus('more')
  }

  const complete = () => {
    track('org_tour_completed', { chapter: status })
    return setStatus('completed')
  }

  const skip = () => {
    track('org_tour_skipped', { step: state?.step })
    return setStatus('skipped')
  }

  // Next explanation of the optional chapter, or the end of the tour
  const next = () => {
    const moreStep = orgChartTourMoreSteps[moreIndex]
    track('org_tour_step_done', { step: moreStep })
    if (moreIndex < orgChartTourMoreSteps.length - 1) {
      setMoreIndex(moreIndex + 1)
      setMoreReached(Math.max(moreReached, moreIndex + 1))
    } else {
      complete()
    }
  }

  // Back to an explanation already read
  const goToMore = (index: number) => {
    if (index <= moreReached) setMoreIndex(index)
  }

  return {
    active: (status === 'started' || status === 'more') && !!state,
    // The optional chapter needs the model's leader and representative roles
    canGoFurther: !!state?.leaderRole && !!state?.representativeRole,
    moreStep: status === 'more' ? orgChartTourMoreSteps[moreIndex] : undefined,
    moreIndex,
    moreReached,
    ...state,
    startMore,
    goToMore,
    next,
    complete,
    skip,
  }
}
