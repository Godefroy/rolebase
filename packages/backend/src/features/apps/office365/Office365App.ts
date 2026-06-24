import type {
  Calendar as OfficeCalendar,
  Event as OfficeEvent,
  Subscription,
} from '@microsoft/microsoft-graph-types-beta'
import { sendEmail } from '@rolebase/emails/helpers/sendEmail'
import { truthy } from '@rolebase/shared/helpers/truthy'
import {
  Calendar,
  CalendarApp,
  Office365SecretConfig,
  OrgCalendarConfig,
} from '@rolebase/shared/model/user_app'
import { Meeting_Set_Input } from '../../../gql'
import settings from '../../../settings'
import { sha1 } from '../../../utils/sha1'
import AbstractCalendarApp, {
  MeetingEvent,
  formatDate,
} from '../AbstractCalendarApp'
import { dateTimeToDate } from './dates/dateTimeToDate'
import { isDateTimeEqual } from './dates/isDateTimeEqual'
import { isRecurrenceEqual } from './dates/isRecurrenceEqual'
import { transformRRuleToRecurrence } from './dates/transformRRuleToRecurrence'

const graphApiUrl = 'https://graph.microsoft.com/v1.0'
const debug = false

// Extended properties
const orgIdProp =
  'String {40c4556b-332e-4207-abcc-ef975c3c5da7} Name RolebaseOrgId'
const meetingIdProp =
  'String {802bbf56-1de9-40ee-83dd-685d727d051d} Name RolebaseMeetingId'
const hashProp =
  'String {53052a96-5ee8-4b27-8a9d-f851fa988ba2} Name RolebaseHash'

// Filters query parts
const filterOrgId = (orgId: string) =>
  `singleValueExtendedProperties/Any(ep: ep/id eq '${orgIdProp}' and ep/value eq '${orgId}')`
const filterMeetingId = (meetingId: string) =>
  `singleValueExtendedProperties/Any(ep: ep/id eq '${meetingIdProp}' and ep/value eq '${meetingId}')`

// Types
interface APIRequest {
  id: string
  method: string
  url: string
  body?: Record<string, any>
}

interface APISettledResponse {
  id: string
  status: number
  headers: {
    'Retry-After': string
    'Content-Type': string
  }
  body: Record<string, any>
}

interface APIBatchResponse {
  responses: APISettledResponse[]
}

export interface TmpDataNotifyLog {
  timestamp: number
  hash: string
  event: Event
  dbMeetingEvent: MeetingEvent
  dbEvent: Event
  meetingChanges: Partial<Meeting_Set_Input>
}

export default class Office365App
  extends AbstractCalendarApp<Office365SecretConfig>
  implements CalendarApp
{
  public async uninstall() {
    try {
      // Disconnect all synchronized calendars
      for (const calendar of this.config.orgsCalendars) {
        await this.disconnectOrgCalendar(calendar)
      }
    } catch (error) {
      console.error(error)
    }

    await super.uninstall()
  }

  // List all user's calendars
  public async listCalendars(): Promise<Calendar[]> {
    const officeCalendars = await this.apiGetAllPages<OfficeCalendar>(
      '/me/calendars?$select=id,name,isDefaultCalendar,canEdit'
    )

    return officeCalendars.map(
      (cal): Calendar => ({
        id: cal.id ?? 'No Id',
        name: cal.name ?? 'No calendar name',
        isDefault: cal.isDefaultCalendar ?? false,
        canEdit: cal.canEdit ?? false,
      })
    )
  }

  // Update/create a meeting (for Hasura trigger event)
  public async upsertMeetingEvent(meetingEvent: MeetingEvent) {
    const orgCalendar = this.config.orgsCalendars.find(
      (c) => c.orgId === meetingEvent.orgId
    )
    if (!orgCalendar) return

    // Fix subscription if missing
    // We call this function here because it's cheap
    // and it happens at a user interaction
    await this.fixMissingSubscription(orgCalendar.calendarId)

    // Get event if it exists
    const existingEvent = await this.fetchMeetingEvent(
      meetingEvent.id,
      orgCalendar.calendarId
    )

    // Update/Create event
    const newEvent = await this.transformMeetingEvent(meetingEvent)

    const event = await this.apiFetch<OfficeEvent>(
      `/me/calendars/${orgCalendar.calendarId}/events${
        existingEvent ? `/${existingEvent.id}` : ''
      }`,
      {
        method: existingEvent ? 'PATCH' : 'POST',
        body: JSON.stringify(newEvent),
      }
    )

    // Delete instances of recurring events at exdates
    if (event.id && event.type === 'seriesMaster' && meetingEvent.exdates) {
      await this.deleteRecurringEventExdates([
        {
          eventId: event.id,
          exdates: meetingEvent.exdates,
        },
      ])
    }
  }

  // Delete a meeting (for Hasura trigger event)
  public async deleteMeetingEvent(meetingId: string, orgId: string) {
    const orgCalendar = this.config.orgsCalendars.find((c) => c.orgId === orgId)
    if (!orgCalendar) return

    // Get event if it exists
    const event = await this.fetchMeetingEvent(
      meetingId,
      orgCalendar.calendarId
    )
    if (event) {
      // Delete event
      await this.apiFetch(
        `/me/calendars/${orgCalendar.calendarId}/events/${event.id}`,
        {
          method: 'DELETE',
        }
      )
    }
  }

  // Delete an occurrence of a recurring meeting
  public async deleteRecurringMeetingOccurrence(
    meetingId: string,
    orgId: string,
    date: Date
  ) {
    const orgCalendar = this.config.orgsCalendars.find((c) => c.orgId === orgId)
    if (!orgCalendar) return

    const event = await this.fetchMeetingEvent(
      meetingId,
      orgCalendar.calendarId
    )
    if (!event?.id || !event.recurrence) return

    await this.deleteRecurringEventExdates([
      {
        eventId: event.id,
        exdates: [formatDate(new Date(date), event.start?.timeZone || 'UTC')],
      },
    ])
  }

  public async onEventCreated(eventId: string, subscriptionId: string) {
    // No action on creation
  }

  public async onEventUpdated(eventId: string, subscriptionId: string) {
    const orgCalendar = this.getOrgCalendarBySubscriptionId(subscriptionId)
    if (!orgCalendar) return
    const { orgId } = orgCalendar

    // Get event
    const event = await this.apiFetch<OfficeEvent>(
      `/me/events/${eventId}?$expand=singleValueExtendedProperties($filter=id eq '${hashProp}' or id eq '${meetingIdProp}')`
    )

    const meetingChanges: Partial<Meeting_Set_Input> = {}
    const resetChanges: Partial<OfficeEvent> = {}

    // Get meeting (or recurring meeting) id from extended properties of event
    const meetingId = event.singleValueExtendedProperties?.find(
      (prop) => prop.id === meetingIdProp
    )?.value
    const hash = event.singleValueExtendedProperties?.find(
      (prop) => prop.id === hashProp
    )?.value

    if (!meetingId) {
      // Event is not linked to a Rolebase meeting or recurring meeting
      return
    }

    if (event.type === 'seriesMaster' && event.recurrence) {
      // Get recurring meeting from database
      const meetingRecurring = await this.getMeetingRecurringById(
        meetingId,
        orgId
      )
      if (!meetingRecurring) return

      const recurringMeetingEvent =
        await this.transformMeetingEvent(meetingRecurring)

      // We can't edit a recurring event, we reset the changed props
      if (recurringMeetingEvent.subject !== event.subject) {
        resetChanges.subject = recurringMeetingEvent.subject
      }
      if (
        !isRecurrenceEqual(recurringMeetingEvent.recurrence, event.recurrence)
      ) {
        resetChanges.recurrence = recurringMeetingEvent.recurrence
      }
      if (!isDateTimeEqual(recurringMeetingEvent.start, event.start)) {
        resetChanges.start = recurringMeetingEvent.start
      }
      if (!isDateTimeEqual(recurringMeetingEvent.end, event.end)) {
        resetChanges.end = recurringMeetingEvent.end
      }

      // We are notified when an occurrence is deleted or an exception is created
      // but we don't know what have changed, so we need to reset occurrences and exceptions
      if (resetChanges.start || resetChanges.end || resetChanges.recurrence) {
        // Exceptions are reset when recurrence changes
      } else {
        // Fix event
        await this.fixRecurringEvent(eventId, meetingRecurring)
        // Don't apply any other change
        return
      }
    } else if (event.type === 'singleInstance') {
      // Skip if hash is right (event was updated by this app)
      const newHash = await this.generateHash(event)
      if (hash === newHash) return

      // Get meeting from database
      const meeting = await this.getMeetingById(meetingId, orgId)
      if (!meeting) {
        // No meeting found
        return
      }

      const meetingEvent = await this.transformMeetingEvent(meeting)

      // Update hash in event to skip next notification
      resetChanges.singleValueExtendedProperties = [
        { id: hashProp, value: newHash },
      ]

      // Reset props that have changed
      if (meetingEvent.subject !== event.subject) {
        resetChanges.subject = meetingEvent.subject
      }
      if (!isDateTimeEqual(meetingEvent.start, event.start)) {
        meetingChanges.startDate = dateTimeToDate(event.start)?.toISOString()
      }
      if (!isDateTimeEqual(meetingEvent.end, event.end)) {
        meetingChanges.endDate = dateTimeToDate(event.end)?.toISOString()
      }

      // Update meeting in database
      if (Object.keys(meetingChanges).length > 0) {
        // Tmp hack to avoid infinite loop
        // Add data to logs and skip if the same update has been made multiple times
        const now = Date.now()
        const logs: TmpDataNotifyLog[] = this.tmpData?.notifyLogs || []
        if (logs.filter((log) => log.hash === newHash).length >= 3) {
          await sendEmail({
            From: {
              Email: settings.mail.sender.email,
              Name: settings.mail.sender.name,
            },
            To: [
              {
                Email: settings.mail.contact,
                Name: settings.mail.sender.name,
              },
            ],
            Subject: 'Office 365 infinite loop',
            TextPart: `Meeting ${meetingId} has been updated too many times.\n\nHash:${newHash}\n${JSON.stringify(
              logs
            )}`,
          })
          return
        }
        await this.updateTmpData({
          notifyLogs: logs
            .filter((log) => log.timestamp > now - 10 * 60 * 1000)
            .concat({
              timestamp: now,
              hash: newHash,
              event,
              dbMeetingEvent: meeting,
              dbEvent: meetingEvent,
              meetingChanges,
            } as TmpDataNotifyLog)
            .slice(-10),
        })

        await this.updateMeeting(meetingId, meetingChanges)
      }
    }

    if (Object.keys(resetChanges).length > 0) {
      // Reset some props of event
      await this.apiFetch(`/me/events/${eventId}`, {
        method: 'PATCH',
        body: JSON.stringify(resetChanges),
      })
    }
  }

  public async onEventDeleted(eventId: string, subscriptionId: string) {
    // No action on delete
  }

  public async onSubscriptionMissed(subscriptionId: string) {
    // No action on subscription missed
  }

  // When subscription is about to expire
  // We extend the subscription
  public async onSubscriptionReauthorizationRequired(subscriptionId: string) {
    if (debug) {
      console.log(
        `[App ${this.userApp.id}] Subscription ${subscriptionId} reauthorization required`
      )
    }
    const orgCalendar = this.getOrgCalendarBySubscriptionId(subscriptionId)
    if (!orgCalendar) return

    await this.apiFetch(`/subscriptions/${subscriptionId}`, {
      method: 'PATCH',
      body: JSON.stringify({
        expirationDateTime: new Date(
          Date.now() + 2 * 24 * 60 * 60 * 1000
        ).toISOString(),
      }),
    })
  }

  // When subscription is deleted, we recreate it
  // We may lose some notifications and the solution would be to delete all events and recreate them
  // but it's cheaper like that.
  public async onSubscriptionRemoved(subscriptionId: string) {
    if (debug) {
      console.log(
        `[App ${this.userApp.id}] Subscription ${subscriptionId} removed`
      )
    }
    const orgCalendar = this.getOrgCalendarBySubscriptionId(subscriptionId)
    if (!orgCalendar) return

    // Delete then recreate subscription
    await this.deleteSubscription(subscriptionId)
    const subscription = await this.createSubscription(orgCalendar.calendarId)

    // Update secret config
    if (subscription.id && subscription.expirationDateTime) {
      await this.updateSecretConfig({
        subscriptions: this.secretConfig.subscriptions
          .filter((s) => s.id !== subscriptionId)
          .concat({
            id: subscription.id,
            calendarId: orgCalendar.calendarId,
            expiryDate: +new Date(subscription.expirationDateTime),
          }),
      })
    }
  }

  // Create events and subscription for a calendar
  protected async connectOrgCalendar(orgCalendar: OrgCalendarConfig) {
    if (debug) {
      console.log(
        `[App ${this.userApp.id}] Connecting calendar ${orgCalendar.calendarId}`
      )
    }
    // Delete existing subscription
    for (const { id, calendarId } of this.secretConfig.subscriptions) {
      if (calendarId !== orgCalendar.calendarId) continue
      await this.deleteSubscription(id)
    }

    // Create all events
    await this.createCalendarEvents(orgCalendar)

    // Start new subscription
    const subscription = await this.createSubscription(orgCalendar.calendarId)

    if (subscription.id && subscription.expirationDateTime) {
      // Update secret config
      await this.updateSecretConfig({
        subscriptions: this.secretConfig.subscriptions
          .filter((s) => s.calendarId !== orgCalendar.calendarId)
          .concat({
            id: subscription.id,
            calendarId: orgCalendar.calendarId,
            expiryDate: +new Date(subscription.expirationDateTime),
          }),
      })
    }
  }

  // Delete events and subscription for a calendar
  protected async disconnectOrgCalendar(orgCalendar: OrgCalendarConfig) {
    if (debug) {
      console.log(
        `[App ${this.userApp.id}] Disconnecting calendar ${orgCalendar.calendarId}`
      )
    }
    // Stop subscription (there shouldn't be more than one, but hey, who knows)
    for (const { id, calendarId } of this.secretConfig.subscriptions) {
      if (calendarId !== orgCalendar.calendarId) continue
      await this.deleteSubscription(id)
    }

    // Update secret config
    await this.updateSecretConfig({
      subscriptions: this.secretConfig.subscriptions.filter(
        (s) => s.calendarId !== orgCalendar.calendarId
      ),
    })

    // Delete all Rolebase events from calendar
    await this.deleteCalendarEvents(orgCalendar)
  }

  // Create events from Rolebase meetings
  private async createCalendarEvents(orgCalendar: OrgCalendarConfig) {
    const meetingsEvents = await this.getOrgMeetings(orgCalendar.orgId)
    if (!meetingsEvents.length) return

    // Create single and recurring events
    const eventsResponses = await this.apiBatch(
      await Promise.all(
        meetingsEvents.map(async (meeting) => ({
          id: meeting.id,
          method: 'POST',
          url: `/me/calendars/${orgCalendar.calendarId}/events`,
          body: await this.transformMeetingEvent(meeting),
        }))
      )
    )

    // Fetch instances that need to be deleted
    await this.deleteRecurringEventExdates(
      eventsResponses
        .map((response) => {
          const recurringEvent = response.body as OfficeEvent
          if (!recurringEvent.id || !recurringEvent.recurrence) return
          const meetingEvent = meetingsEvents.find(
            (event) => event.id === response.id
          )
          if (!meetingEvent || !meetingEvent.exdates?.length) return
          return {
            eventId: recurringEvent.id,
            exdates: meetingEvent.exdates,
          }
        })
        .filter(truthy)
    )
  }

  // Delete all Rolebase events from a calendar
  private async deleteCalendarEvents(orgCalendar: OrgCalendarConfig) {
    // Get Rolebase events from calendar
    const events = await this.apiGetAllPages<OfficeEvent>(
      `/me/calendars/${orgCalendar.calendarId}/events?$filter=${filterOrgId(
        orgCalendar.orgId
      )}&$select=id`
    )
    if (!events.length) return

    // Delete Rolebase events
    await this.apiBatch(
      events.map(({ id }, i) => ({
        id: i.toString(), // Ensure unicity (id is not always unique)
        method: 'DELETE',
        url: `/me/events/${id!}`,
      }))
    )
  }

  // Get event of a meeting if it exists
  private async fetchMeetingEvent(
    meetingId: string,
    calendarId: string
  ): Promise<OfficeEvent | undefined> {
    const events = await this.apiGetAllPages<OfficeEvent>(
      `/me/calendars/${calendarId}/events?$filter=${filterMeetingId(meetingId)}`
    )

    const [event, ...eventsToDelete] = events

    // Delete Rolebase events
    if (eventsToDelete.length > 0) {
      await this.apiBatch(
        events
          .filter((e) => e.id !== event.id) // In case event is in double
          .map(({ id }, i) => ({
            id: i.toString(), // Ensure unicity (id is not always unique)
            method: 'DELETE',
            url: `/me/events/${id!}`,
          }))
      )
    }

    return event
  }

  // Delete occurrences of recurring events at exdates
  private async deleteRecurringEventExdates(
    eventsExdates: Array<{
      eventId: string
      exdates: string[]
    }>
  ) {
    if (eventsExdates.length === 0) return

    // Fetch instances that need to be deleted
    const instancesResponses = await this.apiBatch(
      eventsExdates.flatMap(({ eventId, exdates }) =>
        exdates.map((date, i) => ({
          id: `${eventId}${i}`,
          method: 'GET',
          url: `/me/events/${eventId}/instances?$filter=type eq 'occurrence'&startDateTime=${date}&endDateTime=${date}&$select=id`,
        }))
      )
    )
    const eventsIds = instancesResponses
      .map((response) => response?.body?.value?.[0]?.id)
      .filter(truthy)
    if (eventsIds.length === 0) return

    // Delete all found instances
    await this.apiBatch(
      eventsIds.map((id) => ({
        id,
        method: 'DELETE',
        url: `/me/events/${id}`,
      }))
    )
  }

  // Fix occurrences and exceptions in a recurring event
  private async fixRecurringEvent(eventId: string, meetingEvent: MeetingEvent) {
    if (!meetingEvent.rrule) return

    // Range of dates to fix
    const startDate = new Date()
    startDate.setMonth(startDate.getMonth() - 1)
    const endDate = new Date()
    endDate.setMonth(endDate.getMonth() + 3)

    // Get all existing occurrences and exceptions
    const events = await this.apiGetAllPages<OfficeEvent>(
      `/me/events/${eventId}/instances?$filter=type eq 'occurrence' or type eq 'exception'&startDateTime=${startDate.toISOString()}&endDateTime=${endDate.toISOString()}&$select=id,type,start`
    )

    const requests: APIRequest[] = []

    for (const event of events) {
      const date = dateTimeToDate(event.start)
      if (!date || !event.id) continue
      const dateTz = formatDate(date, meetingEvent.timezone)

      // Delete occurrences at exdates and all exceptions
      if (
        (event.type === 'occurrence' &&
          meetingEvent.exdates?.includes(dateTz)) ||
        event.type === 'exception'
      ) {
        requests.push({
          id: event.id,
          method: 'DELETE',
          url: `/me/events/${event.id}`,
        })
      }
    }

    // Delete occurrences
    await this.apiBatch(requests)
  }

  // Create events from Rolebase meetings
  private async transformMeetingEvent(
    event: MeetingEvent
  ): Promise<OfficeEvent> {
    const officeEvent: OfficeEvent = {
      subject: `${event.role} - ${event.title}`,
      body: {
        contentType: 'html',
        content:
          `Notes : <a href="${event.url}">${event.url}</a>` +
          (event.videoConf
            ? `<br /><br />Visio : <a href="${event.videoConf}">${event.videoConf}</a>`
            : ''),
      },
      start: {
        dateTime: event.startDate,
        timeZone: event.timezone,
      },
      end: {
        dateTime: event.endDate,
        timeZone: event.timezone,
      },
      recurrence: transformRRuleToRecurrence(event.rrule?.mainRrule),
      // Set meetingId and orgId in extended properties
      singleValueExtendedProperties: [
        { id: orgIdProp, value: event.orgId },
        { id: meetingIdProp, value: event.id },
      ],
    }

    // Add hash in extended properties
    officeEvent.singleValueExtendedProperties?.push({
      id: hashProp,
      value: await this.generateHash(officeEvent),
    })

    return officeEvent
  }

  // Compute hash of synchronized properties
  // Useful to skip notifications that have a correct hash
  private async generateHash(event: OfficeEvent): Promise<string> {
    return sha1(
      `${event.subject}${dateTimeToDate(
        event.start
      )?.getTime()}${dateTimeToDate(event.end)?.getTime()}`
    )
  }

  private async createSubscription(calendarId: string): Promise<Subscription> {
    return this.apiFetch<Subscription>('/subscriptions', {
      method: 'POST',
      body: JSON.stringify({
        changeType: 'created,updated',
        notificationUrl: `${settings.backendUrl}/apps/office365/notify`,
        lifecycleNotificationUrl: `${settings.backendUrl}/apps/office365/notify`,
        resource: `/me/calendars/${calendarId}/events`,
        expirationDateTime: new Date(
          Date.now() + 2 * 24 * 60 * 60 * 1000
        ).toISOString(),
        clientState: this.userApp.id,
      } as Subscription),
    })
  }

  private async deleteSubscription(subscriptionId: string) {
    await this.apiFetch(`/subscriptions/${subscriptionId}`, {
      method: 'DELETE',
    })
  }

  // If subscription is missing, create it
  // It shouldn't happen, but we observed it can happen when a timeout occurs
  private async fixMissingSubscription(calendarId: string) {
    const expiryDate =
      this.secretConfig.subscriptions.find((s) => s.calendarId === calendarId)
        ?.expiryDate || 0
    if (expiryDate > Date.now()) {
      // Subscription exists and is not expired
      return
    }
    if (debug) {
      console.log(
        `[App ${this.userApp.id}] Fix missing subscription for calendar ${calendarId}`
      )
    }

    // Create new subscription
    const subscription = await this.createSubscription(calendarId)

    // Update secret config
    if (subscription.id && subscription.expirationDateTime) {
      await this.updateSecretConfig({
        subscriptions: this.secretConfig.subscriptions
          .filter((s) => s.calendarId !== calendarId)
          .concat({
            id: subscription.id,
            calendarId,
            expiryDate: +new Date(subscription.expirationDateTime),
          }),
      })
    }
  }

  private getOrgCalendarBySubscriptionId(
    subscriptionId: string
  ): OrgCalendarConfig | undefined {
    // Get calendar id from subscription id
    const calendarId = this.secretConfig.subscriptions.find(
      (s) => s.id === subscriptionId
    )?.calendarId
    if (!calendarId) return

    // Get config from calendar id
    return this.config.orgsCalendars.find((c) => c.calendarId === calendarId)
  }

  // Get access token, refresh it if needed
  private async getAccessToken(): Promise<string> {
    const isExpired = this.secretConfig.expiryDate < +new Date()
    if (isExpired) await this.refreshAccessToken()

    return this.secretConfig.accessToken
  }

  // Refresh access token
  private async refreshAccessToken() {
    const response = await fetch(
      'https://login.microsoftonline.com/common/oauth2/v2.0/token',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          client_id: settings.apps.office365.clientId,
          client_secret: settings.apps.office365.clientSecret,
          refresh_token: this.secretConfig.refreshToken,
          grant_type: 'refresh_token',
          scope: this.secretConfig.scope,
        }),
      }
    )
    if (!response.ok) {
      // Include the response body so unrecoverable failures (e.g. invalid_grant
      // when the refresh token is revoked/expired) can be detected upstream.
      const body = await response.text().catch(() => '')
      throw new Error(`Error while refreshing access token: ${body}`)
    }
    const responseJson = await response.json()

    const secretConfigChanges = {
      accessToken: responseJson.access_token,
      refreshToken: responseJson.refresh_token,
      expiryDate: +new Date() + responseJson.expires_in * 1000,
    }
    await this.updateSecretConfig(secretConfigChanges)
  }

  private async apiFetch<T>(
    path: string,
    init?: Record<string, any>
  ): Promise<T> {
    if (debug) {
      console.log(
        `[App ${this.userApp.id}] API ${
          init?.method || 'GET'
        } ${path} ${JSON.stringify(init)}`
      )
    }

    let tries = 0
    const maxTries = 5

    while (tries < maxTries) {
      const accessToken = await this.getAccessToken()
      const response = await fetch(`${graphApiUrl}${path}`, {
        method: 'GET',
        ...init,
        headers: {
          ...init?.headers,
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          Prefer: `outlook.timezone="${this.timezone}"`,
        },
      })

      if (response.status === 204 || response.status === 404) {
        // Return empty
        return {} as T
      } else if (response.ok) {
        // Parse JSON response
        return response.json()
      } else if (response.status === 429) {
        // Too many requests, retry after X seconds
        const timeout =
          (Number(response.headers.get('Retry-After')) || 2) * 1000
        await new Promise((resolve) => setTimeout(resolve, timeout))
        tries++
      } else if (response.status === 401) {
        // Unauthorized, refresh token
        await this.refreshAccessToken()
        tries++
      } else {
        throw new Error(
          `API fetch error ${path} => status ${response.status} ${response.statusText}`
        )
      }
    }
    throw new Error('Too many retries')
  }

  private async apiGetAllPages<T>(path: string): Promise<T[]> {
    const rows: T[] = []
    let isDone = false

    // List calendars with pagination
    while (!isDone) {
      const response = await this.apiFetch<{
        value: T[]
        '@odata.nextLink'?: string
      }>(path)

      if (!response.value) {
        throw new Error('No value in response body ' + JSON.stringify(response))
      }
      rows.push(...response.value)

      if (response['@odata.nextLink']) {
        path = response['@odata.nextLink'].replace(graphApiUrl, '')
      } else {
        isDone = true
      }
    }

    return rows
  }

  private async apiBatch(
    requests: APIRequest[]
  ): Promise<APISettledResponse[]> {
    const maxPerBatch = 20
    const nBatches = Math.ceil(requests.length / maxPerBatch)
    const responses: APISettledResponse[] = []

    for (let i = 0; i < nBatches; i++) {
      const batchRequests = requests.slice(
        i * maxPerBatch,
        i * maxPerBatch + maxPerBatch
      )

      const response = await this.apiFetch<APIBatchResponse>(`/$batch`, {
        method: 'POST',
        body: JSON.stringify({
          requests: batchRequests.map((request) => ({
            ...request,
            headers: {
              'Content-Type': 'application/json',
              Prefer: `outlook.timezone="${this.timezone}"`,
            },
          })),
        }),
      })
      responses.push(...response.responses)
    }

    return responses
  }
}
