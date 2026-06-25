import { batchFetchImplementation } from '@jrmdayn/googleapis-batcher'
import { truthy } from '@rolebase/shared/helpers/truthy'
import {
  Calendar,
  CalendarApp,
  GoogleCalendarSecretConfig,
  GoogleCalendarSubscription,
  OrgCalendarConfig,
} from '@rolebase/shared/model/user_app'
import { randomUUID } from 'crypto'
import { Auth, calendar_v3, google } from 'googleapis'
import { Meeting_Set_Input, UserAppFullFragment } from '../../../gql'
import settings from '../../../settings'
import { sha1 } from '../../../utils/sha1'

import AbstractCalendarApp, {
  MeetingEvent,
  formatDate,
} from '../AbstractCalendarApp'
import { dateTimeToDate } from './dates/dateTimeToDate'
import { isDateTimeEqual } from './dates/isDateTimeEqual'

type GoogleEvent = calendar_v3.Schema$Event

const debug = false

// Extended properties
interface ExtendedProperties {
  orgId?: string
  meetingId?: string
  hash?: string
}

export default class GoogleCalendarApp
  extends AbstractCalendarApp<GoogleCalendarSecretConfig>
  implements CalendarApp
{
  private auth: Auth.OAuth2Client
  private calendar: calendar_v3.Calendar
  private calendarBatch: calendar_v3.Calendar
  // Persist promise of the latest token rotation, so refreshToken() can wait for
  // it to hit the database before releasing the connection lock.
  private tokenPersist?: Promise<void>

  constructor(public userApp: UserAppFullFragment) {
    super(userApp)

    // Setup Google Auth
    this.auth = new google.auth.OAuth2({
      clientId: settings.apps.googlecalendar.clientId,
      clientSecret: settings.apps.googlecalendar.clientSecret,
      credentials: {
        access_token: this.secretConfig.accessToken,
        refresh_token: this.secretConfig.refreshToken,
        expiry_date: this.secretConfig.expiryDate,
        scope: this.secretConfig.scope,
      },
    })

    // Save tokens when they change
    this.auth.on('tokens', (tokens) => {
      const partialConfig: Partial<GoogleCalendarSecretConfig> = {}
      if (tokens.access_token) {
        partialConfig.accessToken = tokens.access_token
      }
      if (tokens.refresh_token) {
        partialConfig.refreshToken = tokens.refresh_token
      }
      if (tokens.expiry_date) {
        partialConfig.expiryDate = tokens.expiry_date
      }
      if (tokens.scope) {
        partialConfig.scope = tokens.scope
      }
      if (Object.keys(partialConfig).length) {
        this.tokenPersist = this.updateSecretConfig(partialConfig)
      }
    })

    // Instanciate Google Calendar API
    this.calendar = google.calendar({
      version: 'v3',
      auth: this.auth,
    })
    this.calendarBatch = google.calendar({
      version: 'v3',
      auth: this.auth,
      fetchImplementation: batchFetchImplementation(),
    })
  }

  // Keep the googleapis client in sync with the persisted credentials whenever
  // they are reloaded (e.g. after a concurrent sync refreshed the token), so it
  // doesn't fall back to its own out-of-band refresh.
  protected async reloadSecretConfig(): Promise<GoogleCalendarSecretConfig> {
    const config = await super.reloadSecretConfig()
    this.auth.setCredentials({
      access_token: config.accessToken,
      refresh_token: config.refreshToken,
      expiry_date: config.expiryDate,
      scope: config.scope,
    })
    return config
  }

  // Refresh the access token. Called under the connection lock by
  // ensureValidAccessToken, which has already reloaded secretConfig into the
  // client. googleapis performs the refresh, the 'tokens' handler persists it,
  // and we wait for that write before releasing the lock.
  protected async refreshToken(): Promise<void> {
    await this.auth.getAccessToken()
    await this.tokenPersist
  }

  public async uninstall() {
    try {
      // Disconnect all synchronized calendars
      for (const calendar of this.config.orgsCalendars) {
        await this.disconnectOrgCalendar(calendar)
      }
      await this.auth.revokeCredentials()
    } catch (error) {
      console.error(error)
    }

    await super.uninstall()
  }

  // List all user's calendars
  public async listCalendars(): Promise<Calendar[]> {
    await this.ensureValidAccessToken()
    const { data: calendars } = await this.calendar.calendarList.list()
    if (!calendars.items) {
      throw new Error('No calendars found')
    }

    return calendars.items.map(
      (cal): Calendar => ({
        id: cal.id ?? 'No Id',
        name: cal.summary ?? 'No calendar name',
        isDefault: cal.primary ?? false,
        canEdit: cal.accessRole === 'owner' || cal.accessRole === 'writer',
      })
    )
  }

  // Update/create a meeting (for Hasura trigger event)
  public async upsertMeetingEvent(meetingEvent: MeetingEvent) {
    await this.ensureValidAccessToken()
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

    if (debug) {
      console.log(
        `[App ${this.userApp.id}] ${
          existingEvent?.id ? 'Update' : 'Create'
        } event ${existingEvent?.id} (meeting ${meetingEvent.id})`
      )
    }

    if (existingEvent?.id) {
      await this.calendar.events.update({
        calendarId: orgCalendar.calendarId,
        eventId: existingEvent.id,
        requestBody: newEvent,
      })
    } else {
      await this.calendar.events.insert({
        calendarId: orgCalendar.calendarId,
        requestBody: newEvent,
      })
    }
  }

  // Delete a meeting (for Hasura trigger event)
  public async deleteMeetingEvent(meetingId: string, orgId: string) {
    await this.ensureValidAccessToken()
    const orgCalendar = this.config.orgsCalendars.find((c) => c.orgId === orgId)
    if (!orgCalendar) return

    // Get event if it exists
    const event = await this.fetchMeetingEvent(
      meetingId,
      orgCalendar.calendarId
    )
    if (event?.id) {
      try {
        // Delete event
        await this.calendar.events.delete({
          calendarId: orgCalendar.calendarId,
          eventId: event.id,
        })
      } catch (error) {
        if ((error as any)?.code !== 404) {
          throw error
        }
      }
    }
  }

  // Delete an occurrence of a recurring meeting
  public async deleteRecurringMeetingOccurrence(
    meetingId: string,
    orgId: string,
    date: Date
  ) {
    await this.ensureValidAccessToken()
    const orgCalendar = this.config.orgsCalendars.find((c) => c.orgId === orgId)
    if (!orgCalendar) return

    // Retrieve recurring event to get its id
    const event = await this.fetchMeetingEvent(
      meetingId,
      orgCalendar.calendarId
    )
    if (!event?.id) return

    try {
      await this.calendar.events.delete({
        calendarId: orgCalendar.calendarId,
        eventId: `${event.id}_${date
          .toISOString()
          .substring(0, 19)
          .replace(/[:-]/g, '')}Z`,
      })
    } catch (error) {
      if ((error as any)?.code !== 404) {
        throw error
      }
    }
  }

  public async onSubscriptionNotification(
    subscriptionId: string,
    expiryDate: string
  ) {
    await this.ensureValidAccessToken()
    const { orgCalendar, subscriptionConfig } =
      this.getSubscriptionConfigById(subscriptionId)
    if (!orgCalendar || !subscriptionConfig) return

    // Get sync token
    const syncToken =
      subscriptionConfig.syncToken ||
      (await this.getNewSyncToken(orgCalendar.calendarId))
    if (!syncToken) {
      throw new Error('Unable to get sync token')
    }

    // Get updated events
    const updatedEvents: GoogleEvent[] = []
    let newSyncToken: string | undefined
    let pageToken: string | undefined
    do {
      try {
        const {
          data: { items: events, nextPageToken, nextSyncToken },
        } = await this.calendar.events.list({
          calendarId: orgCalendar.calendarId,
          // Use syncToken to get only updated events
          syncToken,
          pageToken,
        })

        if (events) {
          updatedEvents.push(...events)
        }

        pageToken = nextPageToken || undefined
        if (nextSyncToken) {
          newSyncToken = nextSyncToken
        }
      } catch (error) {
        if ((error as any)?.code === 410) {
          // Sync token expired
          // We need to resync all events
          // We don't need to update syncToken because it will be null
          newSyncToken = await this.getNewSyncToken(orgCalendar.calendarId)
          if (!newSyncToken) {
            throw new Error('Unable to get new sync token')
          }

          // Get last updated event
          const lastUpdatedEvent = await this.fetchLastUpdatedEvent(orgCalendar)
          if (lastUpdatedEvent) {
            updatedEvents.push(lastUpdatedEvent)
          }
          break
        }
      }
    } while (pageToken)

    // Apply changes
    for (const event of updatedEvents) {
      await this.onEventUpdated(event, orgCalendar)
    }

    // Renew subscription if it's too old
    const days25 = 3600 * 24 * 25 * 1000
    if (+new Date(expiryDate) < Date.now() + days25) {
      await this.renewSubscription(subscriptionId, newSyncToken || syncToken)
    }

    // Update syncToken
    else if (newSyncToken) {
      await this.updateSecretConfig({
        subscriptions: this.secretConfig.subscriptions.map((s) =>
          s.id === subscriptionId ? { ...s, syncToken: newSyncToken! } : s
        ),
      })
    }
  }

  private async onEventUpdated(
    event: GoogleEvent,
    orgCalendar: OrgCalendarConfig
  ) {
    if (!event.id) return
    if (debug) {
      console.log(
        `[App ${this.userApp.id}] Event ${event.id} updated: ${JSON.stringify(
          event
        )}`
      )
    }

    const { orgId, calendarId } = orgCalendar
    const meetingChanges: Partial<Meeting_Set_Input> = {}
    const resetChanges: Partial<GoogleEvent> = {}

    // Get meeting (or recurring meeting) id from extended properties of event
    const extendedProperties: ExtendedProperties | undefined =
      event.extendedProperties?.private
    const meetingId = extendedProperties?.meetingId
    const hash = extendedProperties?.hash

    if (!meetingId) {
      // Event is not linked to a Rolebase meeting or recurring meeting
      return
    }

    // Ignore event if cancelled (deleted)
    if (event.status === 'cancelled') {
      return
    }

    if (event.recurrence) {
      // When we change a recurrence after a specific date in Google Calendar,
      // a new recurring event is created with UNTIL in Rrule
      if (event.recurrence.some((r) => r.includes('UNTIL='))) {
        // Delete new recurring event
        await this.calendar.events.delete({
          calendarId,
          eventId: event.id,
        })
        return
      }

      // Get recurring meeting from database
      const meetingRecurring = await this.getMeetingRecurringById(
        meetingId,
        orgId
      )
      if (!meetingRecurring) return

      const recurringMeetingEvent =
        await this.transformMeetingEvent(meetingRecurring)

      // Reset props that have changed
      if (recurringMeetingEvent.summary !== event.summary) {
        resetChanges.summary = recurringMeetingEvent.summary
      }
      // We don't update recurrence here but after start/end,
      // because isRecurrenceEqual doesn't compare exdates
      // if (
      //   !isRecurrenceEqual(recurringMeetingEvent.recurrence, event.recurrence)
      // ) {
      //   resetChanges.recurrence = recurringMeetingEvent.recurrence
      // }
      if (!isDateTimeEqual(recurringMeetingEvent.start, event.start)) {
        resetChanges.start = recurringMeetingEvent.start
      }
      if (!isDateTimeEqual(recurringMeetingEvent.end, event.end)) {
        resetChanges.end = recurringMeetingEvent.end
      }
      if (resetChanges.start || resetChanges.end) {
        resetChanges.recurrence = recurringMeetingEvent.recurrence
      }
    } else if (event.recurringEventId) {
      // Get recurring meeting from database
      const meetingRecurring = await this.getMeetingRecurringById(
        meetingId,
        orgId
      )
      if (!meetingRecurring) return

      const recurringMeetingEvent =
        await this.transformMeetingEvent(meetingRecurring)

      // Reset props that have changed
      if (recurringMeetingEvent.summary !== event.summary) {
        resetChanges.summary = recurringMeetingEvent.summary
      }
      if (event.originalStartTime) {
        if (!isDateTimeEqual(event.start, event.originalStartTime)) {
          resetChanges.start = event.originalStartTime
        }
        const duration =
          new Date(meetingRecurring.endDate).getTime() -
          new Date(meetingRecurring.startDate).getTime()
        const originalEndTime =
          dateTimeToDate(event.originalStartTime)!.getTime() + duration
        if (dateTimeToDate(event.end)?.getTime() !== originalEndTime) {
          const timeZone = event.originalStartTime.timeZone || 'UTC'
          resetChanges.end = {
            dateTime: formatDate(new Date(originalEndTime), timeZone),
            timeZone,
          }
        }
      }
    } else {
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
      resetChanges.extendedProperties = {
        private: {
          hash: newHash,
        },
      }

      // Reset props that have changed
      if (meetingEvent.summary !== event.summary) {
        resetChanges.summary = meetingEvent.summary
      }
      if (!isDateTimeEqual(meetingEvent.start, event.start)) {
        meetingChanges.startDate = dateTimeToDate(event.start)?.toISOString()
      }
      if (!isDateTimeEqual(meetingEvent.end, event.end)) {
        meetingChanges.endDate = dateTimeToDate(event.end)?.toISOString()
      }

      // Update meeting in database
      if (Object.keys(meetingChanges).length > 0) {
        await this.updateMeeting(meetingId, meetingChanges)
      }
    }

    if (Object.keys(resetChanges).length > 0) {
      if (debug) {
        console.log(
          `[App ${this.userApp.id}] Update event ${event.id} ${JSON.stringify(
            resetChanges
          )}`
        )
      }

      // Reset some props of event
      await this.calendar.events.patch({
        calendarId,
        eventId: event.id,
        requestBody: resetChanges,
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
    for (const subscriptionConfig of this.secretConfig.subscriptions) {
      if (subscriptionConfig.calendarId !== orgCalendar.calendarId) continue
      await this.deleteSubscription(subscriptionConfig)
    }

    // Create all events
    await this.createCalendarEvents(orgCalendar)

    // Start new subscription
    const subscription = await this.createSubscription(orgCalendar.calendarId)

    // Update secret config
    if (subscription) {
      await this.updateSecretConfig({
        subscriptions: this.secretConfig.subscriptions
          .filter((s) => s.calendarId !== orgCalendar.calendarId)
          .concat(subscription),
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
    for (const subscriptionConfig of this.secretConfig.subscriptions) {
      if (subscriptionConfig.calendarId !== orgCalendar.calendarId) continue
      await this.deleteSubscription(subscriptionConfig)
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
    await Promise.all(
      meetingsEvents.map(async (meeting) =>
        this.calendarBatch.events.insert({
          calendarId: orgCalendar.calendarId,
          requestBody: await this.transformMeetingEvent(meeting),
        })
      )
    )
  }

  // Delete all Rolebase events from a calendar
  private async deleteCalendarEvents(orgCalendar: OrgCalendarConfig) {
    const eventsIds: string[] = []
    let pageToken: string | undefined

    do {
      // Get Rolebase events from calendar
      const {
        data: { items: events, nextPageToken },
      } = await this.calendar.events.list({
        calendarId: orgCalendar.calendarId,
        privateExtendedProperty: [`orgId=${orgCalendar.orgId}`],
        pageToken,
      })
      if (events) {
        eventsIds.push(
          ...events
            .filter((event) => event.status !== 'cancelled')
            .map((event) => event.id)
            .filter(truthy)
        )
      }

      pageToken = nextPageToken || undefined
    } while (pageToken)

    // Delete Rolebase events
    await Promise.all(
      eventsIds.map((eventId) =>
        this.calendarBatch.events.delete({
          calendarId: orgCalendar.calendarId,
          eventId,
        })
      )
    )
  }

  // Get event of a meeting if it exists
  private async fetchMeetingEvent(
    meetingId: string,
    calendarId: string
  ): Promise<GoogleEvent | undefined> {
    // Event if we're using maxResults = 1,
    // documentation says that we can get an empty list with a nextPageToken
    // so we need to iterate until we get an event or no nextPageToken
    let pageToken: string | undefined
    do {
      const {
        data: { items: events, nextPageToken },
      } = await this.calendar.events.list({
        calendarId,
        privateExtendedProperty: [`meetingId=${meetingId}`],
        pageToken,
      })
      // Single instances of recurring events have the same meetingId
      const event = events?.find((e) => !e.recurringEventId)
      if (event) {
        return event
      }
      pageToken = nextPageToken || undefined
    } while (pageToken)
  }

  // Get last updated event in calendar
  private async fetchLastUpdatedEvent(orgCalendar: OrgCalendarConfig) {
    let event: GoogleEvent | undefined
    let pageToken: string | undefined

    do {
      const {
        data: { items: events, nextPageToken },
      } = await this.calendar.events.list({
        calendarId: orgCalendar.calendarId,
        privateExtendedProperty: [`orgId=${orgCalendar.orgId}`],
        orderBy: 'updated',
        pageToken,
      })

      pageToken = nextPageToken || undefined

      // Get last event
      if (events && !pageToken) {
        event = events[events.length - 1]
      }
    } while (pageToken)

    return event
  }

  // Create events from Rolebase meetings
  private async transformMeetingEvent(
    event: MeetingEvent
  ): Promise<GoogleEvent> {
    const googleEvent: GoogleEvent = {
      summary: `${event.role} - ${event.title}`,
      description:
        `Notes : <a href="${event.url}">${event.url}</a>` +
        (event.videoConf
          ? `<br /><br />Visio : <a href="${event.videoConf}">${event.videoConf}</a>`
          : ''),
      start: {
        dateTime: event.startDate,
        timeZone: event.timezone,
      },
      end: {
        dateTime: event.endDate,
        timeZone: event.timezone,
      },
      // Construct rrule array from meeting rrule and exdates
      recurrence: event.rrule && [
        ...event.rrule
          .toString()
          .replace(/^DTSTART.*(\n|$)/m, '')
          .replace(/^DTEND.*(\n|$)/m, '')
          .split('\n'),
        ...(event.exdates?.map(
          (date) => `EXDATE;TZID=${event.timezone}:${date.replace(/[:-]/g, '')}`
        ) || []),
      ],
      // Set meetingId and orgId in extended properties
      extendedProperties: {
        private: {
          orgId: event.orgId,
          meetingId: event.id,
        },
      },
    }

    // Add hash in extended properties
    const privateExtendedProperty = googleEvent.extendedProperties?.private
    if (privateExtendedProperty) {
      privateExtendedProperty.hash = await this.generateHash(googleEvent)
    }

    return googleEvent
  }

  // Compute hash of synchronized properties
  // Useful to skip notifications that have a correct hash
  private async generateHash(event: GoogleEvent): Promise<string> {
    return sha1(
      `${event.summary}${dateTimeToDate(
        event.start
      )?.getTime()}${dateTimeToDate(event.end)?.getTime()}`
    )
  }

  private async createSubscription(
    calendarId: string,
    syncToken?: string
  ): Promise<GoogleCalendarSubscription | undefined> {
    try {
      const { data: subscription } = await this.calendar.events.watch({
        calendarId,
        requestBody: {
          id: randomUUID(),
          token: this.userApp.id,
          type: 'web_hook',
          address: `${settings.backendUrl}/apps/googlecalendar/notify`,
          params: {
            ttl: '2592000', // Max expiration date (30 days)
          },
        },
      })

      if (
        !subscription.id ||
        !subscription.resourceId ||
        !subscription.expiration
      ) {
        throw new Error(
          `Unable to create subscription for calendar ${calendarId}: ${JSON.stringify(
            subscription
          )}`
        )
      }

      // Get new sync token if not provided
      if (syncToken) {
        syncToken = await this.getNewSyncToken(calendarId)
      }

      return {
        id: subscription.id,
        calendarId,
        resourceId: subscription.resourceId,
        expiryDate: +subscription.expiration,
        syncToken: syncToken || null,
      }
    } catch (error) {
      console.error(error)
      return
    }
  }

  private async getNewSyncToken(calendarId: string) {
    let pageToken: string | undefined
    do {
      const {
        data: { nextSyncToken, nextPageToken },
      } = await this.calendar.events.list({
        calendarId,
        maxResults: 2500,
        fields: 'nextSyncToken,nextPageToken',
        pageToken,
      })
      if (nextSyncToken) {
        return nextSyncToken
      }
      pageToken = nextPageToken || undefined
    } while (pageToken)
  }

  // When subscription is too old, we recreate it
  private async renewSubscription(subscriptionId: string, syncToken: string) {
    if (debug) {
      console.log(
        `[App ${this.userApp.id}] Subscription ${subscriptionId} renew`
      )
    }
    const { orgCalendar, subscriptionConfig } =
      this.getSubscriptionConfigById(subscriptionId)
    if (!orgCalendar || !subscriptionConfig) return

    // Delete then recreate subscription
    await this.deleteSubscription(subscriptionConfig)
    const subscription = await this.createSubscription(
      orgCalendar.calendarId,
      syncToken
    )

    // Update secret config
    if (subscription) {
      await this.updateSecretConfig({
        subscriptions: this.secretConfig.subscriptions
          .filter((s) => s.id !== subscriptionId)
          .concat(subscription),
      })
    }
  }

  private async deleteSubscription(
    subscriptionConfig: GoogleCalendarSubscription
  ) {
    try {
      await this.calendar.channels.stop({
        requestBody: {
          id: subscriptionConfig.id,
          resourceId: subscriptionConfig.resourceId,
        },
      })
    } catch (error) {
      if ((error as any)?.code !== 404) {
        throw error
      }
    }
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
    if (subscription) {
      await this.updateSecretConfig({
        subscriptions: this.secretConfig.subscriptions
          .filter((s) => s.calendarId !== calendarId)
          .concat(subscription),
      })
    }
  }

  private getSubscriptionConfigById(subscriptionId: string) {
    // Get calendar id from subscription id
    const subscriptionConfig = this.secretConfig.subscriptions.find(
      (s) => s.id === subscriptionId
    )

    // Get config from calendar id
    const orgCalendar =
      subscriptionConfig &&
      this.config.orgsCalendars.find(
        (c) => c.calendarId === subscriptionConfig.calendarId
      )

    return { orgCalendar, subscriptionConfig }
  }
}
