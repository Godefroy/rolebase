import { getOrgPath } from '@rolebase/shared/helpers/getOrgPath'
import { truthy } from '@rolebase/shared/helpers/truthy'
import { gql, MeetingRecurringFragment } from '../../../gql'
import settings from '../../../settings'
import { adminRequest } from '../../../utils/adminRequest'
import { HasuraEvent } from '../../../utils/nhost'
import { appFactory } from '../../apps'
import AbstractCalendarApp from '../../apps/AbstractCalendarApp'
import { loadOrgData } from '../../org/loadOrgData'
import { IndexEntity } from './IndexEntity'

// Notify calendar apps of users when one of those props changes
const appNotifyProps: Array<keyof MeetingRecurringFragment> = [
  'templateId',
  'rrule',
  'duration',
]

export class IndexMeetingRecurring extends IndexEntity<MeetingRecurringFragment> {
  static table = 'public.meeting_recurring'

  async applyEvent(event: HasuraEvent<MeetingRecurringFragment>) {
    // Compute participants to notify calendars apps of corresponding users
    const { data } = event.event
    const meetingId = data.new?.id || data.old?.id
    const orgId = data.new?.orgId || data.old?.orgId
    if (!meetingId || !orgId) return

    const result = await adminRequest(
      gql(`
        query GetMeetingRecurringDataForSearch($meetingId: uuid!, $orgId: uuid!) {
          meeting_recurring_by_pk(id: $meetingId) {
            ...MeetingRecurring
            meetings {
              id
              recurringDate
            }
          }
          org_by_pk(id: $orgId) {
            id
            slug
            members(where: { archived: { _eq: false } }) {
              ...Member
              user {
                apps {
                  ...UserAppFull
                }
              }
            }
          }
        }
      `),
      { meetingId, orgId }
    )

    const meetingRecurring = result.meeting_recurring_by_pk
    const exdates =
      meetingRecurring?.meetings.map((m) => m.recurringDate).filter(truthy) ||
      []
    const org = result.org_by_pk
    const members = org?.members
    if (!org || !members) {
      console.error(
        `Could not find meeting_recurring data for notification: ${meetingId} -> ${JSON.stringify(
          result
        )}`
      )
      return
    }

    const orgData = await loadOrgData(orgId)

    const prevParticipants = data.old
      ? orgData.getScopeMemberIds(data.old.scope)
      : []
    const nextParticipants = data.new
      ? orgData.getScopeMemberIds(data.new.scope)
      : []

    const orgUrl = `${settings.url}${getOrgPath(org)}`

    for (const nextParticipant of nextParticipants) {
      // Don't upsert if nothing has changed
      if (prevParticipants.includes(nextParticipant)) {
        const hasChanged = appNotifyProps.some(
          (prop) => data.new?.[prop] !== data.old?.[prop]
        )
        if (!hasChanged) continue
      }

      // Create/Update event
      const member = members.find((m) => m.id === nextParticipant)
      if (!member || !meetingRecurring) continue
      const userApps = member.user?.apps || []
      for (const userApp of userApps) {
        const app = appFactory(userApp)
        await app.upsertMeetingEvent(
          AbstractCalendarApp.transformMeetingRecurringToEvent(
            meetingRecurring,
            exdates,
            orgUrl
          )
        )
      }
    }
    for (const prevParticipant of prevParticipants) {
      if (!nextParticipants.includes(prevParticipant)) {
        // Delete event
        const member = members.find((m) => m.id === prevParticipant)
        if (!member) continue
        const userApps = member.user?.apps || []
        for (const userApp of userApps) {
          const app = appFactory(userApp)
          const meeting = data.old!
          await app.deleteMeetingEvent(meeting.id, meeting.orgId)
        }
        continue
      }
    }
  }
}
