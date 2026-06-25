import { RRuleUTC } from '@rolebase/shared/helpers/RRuleUTC'
import getMeetingVideoConfUrl from '@rolebase/shared/helpers/getMeetingVideoConfUrl'
import { getOrgPath } from '@rolebase/shared/helpers/getOrgPath'
import { truthy } from '@rolebase/shared/helpers/truthy'
import {
  AppCalendarConfig,
  OAuthSecretConfig,
  OrgCalendarConfig,
} from '@rolebase/shared/model/user_app'
import { formatInTimeZone } from 'date-fns-tz'
import {
  MeetingFragment,
  MeetingRecurringFragment,
  Meeting_Insert_Input,
  Meeting_Set_Input,
  gql,
} from '../../gql'
import settings from '../../settings'
import { adminRequest } from '../../utils/adminRequest'
import { loadOrgData } from '../org/loadOrgData'
import AbstractApp from './AbstractApp'

export interface MeetingEvent {
  id: string
  orgId: string
  title: string
  role: string
  startDate: string // ISO date string
  endDate: string // ISO date string
  timezone: string
  rrule?: RRuleUTC
  exdates?: string[] // ISO date strings
  url: string
  videoConf?: string
}

export function formatDate(date: Date, timezone: string): string {
  return formatInTimeZone(date, timezone, "yyyy-MM-dd'T'HH:mm:ss")
}

// Refresh proactively a bit before the actual expiry.
const TOKEN_EXPIRY_MARGIN_MS = 60_000

export default abstract class AbstractCalendarApp<
  SecretConfig extends OAuthSecretConfig,
> extends AbstractApp<SecretConfig, AppCalendarConfig> {
  // Abstract methods to implement
  protected abstract connectOrgCalendar(
    orgCalendar: OrgCalendarConfig
  ): Promise<void>
  protected abstract disconnectOrgCalendar(
    orgCalendar: OrgCalendarConfig
  ): Promise<void>

  // Provider-specific token refresh, run serialized under the connection lock by
  // ensureValidAccessToken() (so it never runs concurrently for the same app).
  protected abstract refreshToken(): Promise<void>

  // Ensure a valid access token. Refreshes under the per-connection lock, so
  // concurrent syncs of the same app never refresh in parallel: the first
  // refreshes, the others reload the freshly persisted token and skip.
  // Pass force = true when the provider rejected the current token (HTTP 401)
  // even though it looks unexpired: it then refreshes unless a concurrent sync
  // already swapped the token for a different one.
  protected async ensureValidAccessToken(force = false): Promise<void> {
    if (!force && this.secretConfig.expiryDate > Date.now() + TOKEN_EXPIRY_MARGIN_MS) {
      return
    }
    const previousAccessToken = this.secretConfig.accessToken
    await this.withRefreshLock(async () => {
      // A concurrent sync may have refreshed while we waited for the lock.
      await this.reloadSecretConfig()
      const expired =
        this.secretConfig.expiryDate <= Date.now() + TOKEN_EXPIRY_MARGIN_MS
      const stillStale =
        force && this.secretConfig.accessToken === previousAccessToken
      if (expired || stillStale) {
        await this.refreshToken()
      }
    })
  }

  // Select calendars for availability and meetings
  public async selectCalendars(
    availabilityCalendars: string[],
    orgsCalendars: OrgCalendarConfig[]
  ) {
    if (
      orgsCalendars.some(
        (c) =>
          !availabilityCalendars.find(
            (calendarId) => calendarId === c.calendarId
          )
      )
    ) {
      throw new Error(
        'Orgs calendars must be included in availability calendars'
      )
    }

    const prevOrgsCalendars = this.config.orgsCalendars

    await this.updateConfig({
      availabilityCalendars,
      orgsCalendars,
    })

    // Enable/disable connections between calendars and orgs meetings
    for (const orgCalendar of orgsCalendars) {
      const prevOrgCalendar = prevOrgsCalendars.find(
        (c) => c.calendarId === orgCalendar.calendarId
      )
      if (prevOrgCalendar) {
        // Calendar already connected
        if (prevOrgCalendar.orgId === orgCalendar.orgId) {
          // Same org, do nothing
          continue
        }

        // Different org, delete previous events
        await this.disconnectOrgCalendar(prevOrgCalendar)
      }
      await this.connectOrgCalendar(orgCalendar)
    }
    for (const prevOrgCalendar of prevOrgsCalendars) {
      const orgCalendar = orgsCalendars.find(
        (c) => c.calendarId === prevOrgCalendar.calendarId
      )
      if (!orgCalendar) {
        // Calendar not connected anymore, delete events
        await this.disconnectOrgCalendar(prevOrgCalendar)
      }
    }
  }

  // Get all meetings of an organization
  protected async getOrgMeetings(orgId: string): Promise<MeetingEvent[]> {
    // Search meetings with start date after 30 days ago
    const afterDate = new Date(
      Date.now() - 30 * 24 * 60 * 60 * 1000
    ).toISOString()

    const orgResult = await adminRequest(GET_MEETINGS, {
      orgId,
      userId: this.userApp.userId,
      afterDate,
    })

    const org = orgResult.org_by_pk
    if (!org) return []

    const member = org.members[0]
    if (!member) return []
    const meetings = org.meetings

    // Setup calendar
    const events: MeetingEvent[] = []

    const orgUrl = `${settings.url}${getOrgPath(org)}`

    // Add events
    for (const meeting of meetings) {
      events.push(
        this.transformMeetingToEvent(
          meeting,
          orgUrl,
          meeting.circle.role.name,
          member.name
        )
      )
    }

    // Filter recurring meetings
    const orgData = await loadOrgData(orgId)
    const recurringMeetings = orgData.filterScopedEntities(
      org.meetings_recurring,
      member.id
    )

    // Add recurring events
    for (const recurringMeeting of recurringMeetings) {
      const exdates = recurringMeeting.meetings
        .map((meeting) => meeting.recurringDate)
        .filter(truthy)

      // Add event
      events.push(
        AbstractCalendarApp.transformMeetingRecurringToEvent(
          recurringMeeting,
          exdates,
          orgUrl
        )
      )
    }

    return events
  }

  // Get all meetings of an organization
  protected async getMeetingById(
    meetingId: string,
    orgId: string
  ): Promise<MeetingEvent | undefined> {
    const orgResult = await adminRequest(GET_MEETING, {
      meetingId,
      userId: this.userApp.userId,
    })

    const meeting = orgResult.meeting_by_pk
    if (!meeting || meeting.orgId !== orgId || meeting.archivedAt) return
    const member = meeting.org.members[0]
    if (!member) return

    const orgUrl = `${settings.url}${getOrgPath(meeting.org)}`

    // Add event
    return this.transformMeetingToEvent(
      meeting,
      orgUrl,
      meeting.circle.role.name,
      member.name
    )
  }

  // Get all recurring meetings of an organization
  protected async getMeetingRecurringById(
    meetingId: string,
    orgId: string
  ): Promise<MeetingEvent | undefined> {
    const orgResult = await adminRequest(GET_MEETING_RECURRING, {
      meetingId,
      userId: this.userApp.userId,
    })

    const meeting = orgResult.meeting_recurring_by_pk
    if (!meeting || meeting.orgId !== orgId) return
    const member = meeting.org.members[0]
    if (!member) return

    const orgUrl = `${settings.url}${getOrgPath(meeting.org)}`

    // Add event
    return AbstractCalendarApp.transformMeetingRecurringToEvent(
      meeting,
      meeting.meetings.map((m) => m.recurringDate).filter(truthy),
      orgUrl
    )
  }

  // Create a meeting
  protected async createMeeting(
    meeting: Partial<Meeting_Insert_Input>
  ): Promise<void> {
    await adminRequest(CREATE_MEETING, {
      meeting: { ...meeting, lastUpdateSource: this.userApp.id },
    })
  }

  // Update a meeting
  protected async updateMeeting(
    meetingId: string,
    values: Partial<Meeting_Set_Input>
  ): Promise<void> {
    await adminRequest(UPDATE_MEETING, {
      meetingId,
      values: { ...values, lastUpdateSource: this.userApp.id },
    })
  }

  // Delete a meeting
  protected async deleteMeeting(meetingId: string): Promise<void> {
    await adminRequest(DELETE_MEETING, {
      meetingId,
    })
  }

  public transformMeetingToEvent(
    meeting: MeetingFragment,
    orgUrl: string,
    roleName: string,
    memberName: string
  ): MeetingEvent {
    const url = `${orgUrl}/meetings/${meeting.id}`

    // Convert dates to user timezone
    const startDate = formatDate(new Date(meeting.startDate), this.timezone)
    const endDate = formatDate(new Date(meeting.endDate), this.timezone)

    // Event description
    const videoConf = getMeetingVideoConfUrl(meeting, roleName, memberName)

    return {
      id: meeting.id,
      orgId: meeting.orgId,
      title: meeting.title,
      role: roleName,
      startDate,
      endDate,
      timezone: this.timezone,
      url,
      videoConf,
    }
  }

  public static transformMeetingRecurringToEvent(
    meeting: MeetingRecurringFragment,
    exdates: string[],
    orgUrl: string
  ): MeetingEvent {
    const url = `${orgUrl}/meetings-recurring/${meeting.id}`

    const rrule = new RRuleUTC(meeting.rrule)

    // Start date is set to next occurrence date
    // to avoid showing past occurrences
    const nextDate = rrule.after(new Date(), true)
    if (!nextDate) {
      throw new Error('Could not find next date for recurring meeting')
    }
    rrule.changeStartDate(nextDate)
    const startDate = formatDate(nextDate, rrule.timezone)
    const endDate = formatDate(
      new Date(nextDate.getTime() + meeting.duration * 60 * 1000),
      rrule.timezone
    )
    const now = formatDate(new Date(), rrule.timezone)

    return {
      id: meeting.id,
      orgId: meeting.orgId,
      title: meeting.template.title,
      role: meeting.circle.role.name,
      startDate,
      endDate,
      timezone: rrule.timezone,
      rrule,
      exdates: exdates
        .map((date) => formatDate(new Date(date), rrule.timezone))
        .filter((date) => date > now),
      url,
    }
  }

  protected findMeetingIdInContent(content: string): string | undefined {
    const matchMeeting = content.match(
      new RegExp(
        `${settings.url}/(?:orgs/[a-z0-9-]+|[a-z0-9]+(?:-[a-z0-9]+)*)/meetings/([a-z0-9-]+)`
      )
    )
    if (!matchMeeting) return
    const [, meetingId] = matchMeeting
    return meetingId
  }

  protected findMeetingRecurringIdInContent(
    content: string
  ): string | undefined {
    const matchMeeting = content.match(
      new RegExp(
        `${settings.url}/(?:orgs/[a-z0-9-]+|[a-z0-9]+(?:-[a-z0-9]+)*)/meetings-recurring/([a-z0-9-]+)`
      )
    )
    if (!matchMeeting) return
    const [, meetingId] = matchMeeting
    return meetingId
  }
}

const GET_MEETINGS = gql(`
  query getOrgMeetingsForCalendarApp(
    $orgId: uuid!
    $userId: uuid!
    $afterDate: timestamptz!
  ) {
    org_by_pk(id: $orgId) {
      id
      name
      slug
      members(where: { userId: { _eq: $userId }, archivedAt: { _is_null: true } }) {
        id
        name
      }
      meetings(
        where: {
          startDate: { _gt: $afterDate }
          archivedAt: { _is_null: true }
          meeting_attendees: { member: { userId: { _eq: $userId } } }
        }
        order_by: { startDate: asc }
      ) {
        ...Meeting
        circle {
          role {
            name
          }
        }
      }
      meetings_recurring(where: { archivedAt: { _is_null: true } }) {
        ...MeetingRecurring
        meetings {
          recurringDate
        }
      }
    }
  }

`)

const GET_MEETING = gql(`
  query getMeetingForCalendarApp($meetingId: uuid!, $userId: uuid!) {
    meeting_by_pk(id: $meetingId) {
      ...Meeting
      circle {
        role {
          name
        }
      }
      org {
        id
        name
        slug
        members(where: {
          userId: { _eq: $userId }
          archivedAt: { _is_null: true }
        }) {
          id
          name
        }
      }
    }
  }
`)

const GET_MEETING_RECURRING = gql(`
  query getMeetingRecurringForCalendarApp($meetingId: uuid!, $userId: uuid!) {
    meeting_recurring_by_pk(id: $meetingId) {
      ...MeetingRecurring
      meetings {
        recurringDate
      }
      org {
        id
        name
        slug
        members(where: {
          userId: { _eq: $userId }
          archivedAt: { _is_null: true }
        }) {
          id
          name
        }
        meetings {
          recurringDate
        }
      }
    }
  }
`)

const CREATE_MEETING = gql(`
  mutation createMeetingForCalendarApp($meeting: meeting_insert_input!) {
    insert_meeting_one(object: $meeting) {
      id
    }
  }
`)

const UPDATE_MEETING = gql(`
  mutation updateMeetingForCalendarApp($meetingId: uuid!, $values: meeting_set_input!) {
    update_meeting_by_pk(pk_columns: { id: $meetingId }, _set: $values) {
      id
    }
  }
`)

const DELETE_MEETING = gql(`
  mutation deleteMeetingForCalendarApp($meetingId: uuid!) {
    delete_meeting_by_pk(id: $meetingId) {
      id
    }
  }
`)
