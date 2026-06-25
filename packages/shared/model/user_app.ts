export interface Calendar {
  id: string
  name: string
  isDefault: boolean
  canEdit: boolean
}

// Interface of CalendarApp classes extending AbstractCalendarApp
// Used in front for RPC calls
export interface CalendarApp {
  uninstall(): Promise<void>
  listCalendars(): Promise<Calendar[]>
  selectCalendars(
    availabilityCalendars: string[],
    orgsCalendars: OrgCalendarConfig[]
  ): Promise<void>
}

// App config available on the frontend
export interface AppCalendarConfig {
  email: string
  availabilityCalendars: string[]
  orgsCalendars: OrgCalendarConfig[]
}

export interface OrgCalendarConfig {
  orgId: string
  calendarId: string
}

// Common OAuth token fields shared by calendar app secret configs
export interface OAuthSecretConfig {
  accessToken: string
  refreshToken: string
  expiryDate: number // Unix timestamp
  scope: string
}

// Office 365 secret config
export interface Office365SecretConfig extends OAuthSecretConfig {
  subscriptions: Office365Subscription[]
}

export interface Office365Subscription {
  id: string
  calendarId: string
  expiryDate: number // Unix timestamp
}

// Google Calendar secret config
export interface GoogleCalendarSecretConfig extends Office365SecretConfig {
  subscriptions: GoogleCalendarSubscription[]
}

export interface GoogleCalendarSubscription extends Office365Subscription {
  resourceId: string
  syncToken: string | null
}
