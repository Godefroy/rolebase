import sendMeetingEmail from '@rolebase/emails/helpers/sendMeetingEmail'
import { getOrgPath } from '@rolebase/shared/helpers/getOrgPath'
import { SearchDoc, SearchTypes } from '@rolebase/shared/model/search'
import { DocumentType, MeetingFragment, gql } from '../../../gql'
import settings from '../../../settings'
import { adminRequest } from '../../../utils/adminRequest'
import { HasuraEvent } from '../../../utils/nhost'
import { captureError } from '../../../utils/sentry'
import { appFactory } from '../../apps'
import { IndexEntity } from './IndexEntity'

const Fragment = gql(`
  fragment MeetingSearch on meeting {
    id
    orgId
    title
    circle {
      role {
        name
      }
    }
    steps {
      notes
    }
    createdAt
    startDate
  }
`)

const transform = (fragment: DocumentType<typeof Fragment>): SearchDoc => ({
  objectID: fragment.id,
  orgId: fragment.orgId,
  type: SearchTypes.Meeting,
  title: `${fragment.circle.role.name} - ${fragment.title}`,
  description: fragment.steps.map((step) => step.notes).join('\n'),
  boost: 0,
})

// Notify calendar apps of users when one of those props changes
const appNotifyProps: Array<keyof MeetingFragment> = [
  'startDate',
  'endDate',
  'title',
  'archivedAt',
  'videoConf',
]

export class IndexMeeting extends IndexEntity<MeetingFragment> {
  static table = 'public.meeting'

  async getById(id: string) {
    const { meeting_by_pk: meeting } = await adminRequest(
      gql(`
        query GetMeetingForSearch($id: uuid!) {
          meeting_by_pk(id: $id) {
            ...MeetingSearch
          }
        }
      `),
      { id }
    )
    if (!meeting) return undefined
    return meeting && transform(meeting)
  }

  async getAll() {
    const { meeting } = await adminRequest(
      gql(`
        query GetMeetingsForSearch {
          meeting(where: { archivedAt: { _is_null: true } }) {
            ...MeetingSearch
          }
        }
      `)
    )
    return meeting.map(transform)
  }

  async applyEvent(event: HasuraEvent<MeetingFragment>) {
    try {
      super.applyEvent(event)
    } catch (error) {
      console.log(error)
      captureError(error as any)
    }

    // Compute participants to notify calendars apps of corresponding users
    const { data } = event.event
    const meeting = data.new
    if (!meeting) return

    // Skip if there is a lastUpdateSource
    const lastUpdateSource = (data.new as any)?.lastUpdateSource
    if (lastUpdateSource) {
      await resetLastUpdateSource(meeting.id)
    }

    const result = await adminRequest(
      gql(`
        query GetMeetingDataForSearch($meetingId: uuid!) {
          meeting_by_pk(id: $meetingId) {
            org {
              id
              slug
            }
            circle {
              role {
                name
              }
            }
            meeting_attendees {
              id
              present
              startNotified
              member {
                id
                name
                archivedAt
                user {
                  email
                  locale
                  metadata
                  apps(where: { archivedAt: { _is_null: true } }) {
                    ...UserAppFull
                  }
                }
              }
            }
          }
        }
      `),
      { meetingId: meeting.id }
    )

    const roleName = result.meeting_by_pk?.circle.role.name
    const attendees = result.meeting_by_pk?.meeting_attendees
    const org = result.meeting_by_pk?.org
    if (!roleName || !attendees || !org) {
      console.error(
        `Could not find meeting data for notification: ${
          meeting.id
        } -> ${JSON.stringify(result)}`
      )
      return
    }

    try {
      // Meeting has just been started
      if (
        data.old?.currentStepId === null &&
        meeting.currentStepId !== null &&
        meeting.ended === false
      ) {
        // Send start notification to new attendee if meeting is started
        const attendeesToNotify = attendees.filter(
          (attendee) =>
            attendee.member.archivedAt == null &&
            // Attendee is present and have not been notified
            attendee.startNotified === false &&
            attendee.present !== false &&
            // Member has email
            attendee.member.user?.email
        )
        if (attendeesToNotify.length > 0) {
          // Send emails
          for (const attendee of attendeesToNotify) {
            const member = attendee.member!
            const user = member.user!
            await sendMeetingEmail(
              {
                lang: user.locale,
                timezone: user.metadata.timezone || settings.defaultTimezone,
                title: meeting.title,
                role: roleName,
                startDate: meeting.startDate,
                endDate: meeting.endDate,
                ctaUrl: `${settings.url}${getOrgPath(org)}/meetings/${
                  meeting.id
                }`,
              },
              [
                {
                  Email: user.email!,
                  Name: member.name,
                },
              ]
            )
          }

          // Update attendees startNotified
          await adminRequest(UPDATE_ATTENDEES_START_NOTIFIED, {
            ids: attendeesToNotify.map(({ id }) => id),
          })
        }
      }
    } catch (error) {
      console.log(error)
      captureError(error as any)
    }

    // Don't update calendar apps if nothing has changed
    const hasChanged = appNotifyProps.some(
      (prop) => data.new?.[prop] !== data.old?.[prop]
    )
    if (!hasChanged) return

    // Update calendars apps
    const orgUrl = `${settings.url}${getOrgPath(org)}`

    for (const { member } of attendees) {
      if (member.archivedAt) continue

      const userApps = member.user?.apps || []
      for (const userApp of userApps) {
        // Skip if last modif comes from this app
        if (lastUpdateSource === userApp.id) continue

        try {
          const app = appFactory(userApp)

          if (data.old) {
            if (meeting.archivedAt) {
              // Delete event if meeting is archived
              await app.deleteMeetingEvent(meeting.id, meeting.orgId)
            } else {
              // Update event
              // Note: we don't update at creation
              // because the trigger for meeting_attendee is handling that
              await app.upsertMeetingEvent(
                app.transformMeetingToEvent(
                  meeting,
                  orgUrl,
                  roleName,
                  member.name
                )
              )
            }
          } else if (meeting.recurringId && meeting.recurringDate) {
            // Newly created occurrence of a recurring meeting
            // Delete event occurrence for attendees inserted at creation
            await app.deleteRecurringMeetingOccurrence(
              meeting.recurringId,
              meeting.orgId,
              new Date(meeting.recurringDate)
            )
          }
        } catch (error) {
          console.log(error)
          captureError(error as any)
        }
      }
    }
  }
}

async function resetLastUpdateSource(meetingId: string) {
  await adminRequest(
    gql(`
      mutation ResetLastUpdateSource($id: uuid!) {
        update_meeting_by_pk(
          pk_columns: { id: $id }
          _set: { lastUpdateSource: null }
        ) {
          id
        }
      }
    `),
    { id: meetingId }
  )
}

const UPDATE_ATTENDEES_START_NOTIFIED = gql(`
  mutation updateAttendeesStartNotified($ids: [uuid!]!) {
    update_meeting_attendee(
      where: { id: { _in: $ids } }
      _set: { startNotified: true }
    ) {
      returning {
        id
      }
    }
  }`)
