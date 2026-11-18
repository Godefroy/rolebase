import { App_Type_Enum } from '@gql'
import React from 'react'
import settings from 'src/settings'
import { trpc } from 'src/trpc'
import GoogleCalendarIcon from './images/googlecalendar.svg?react'
import Office365Icon from './images/office365.svg?react'

const appsUrl = `${settings.url}/apps`

// Params bound to the browser that starts the flow (see oauthFlow.ts)
const getFlowParams = (state: string, codeChallenge: string) =>
  `&state=${encodeURIComponent(state)}&code_challenge=${encodeURIComponent(
    codeChallenge
  )}&code_challenge_method=S256`

const appsParams: Record<App_Type_Enum, AppParams> = {
  // Office 365
  [App_Type_Enum.Office365]: {
    icon: Office365Icon,
    getAuthUrl: (state, codeChallenge) =>
      `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?response_type=code&scope=${[
        'User.Read',
        'Calendars.Read',
        'Calendars.ReadWrite',
        'offline_access',
      ].join(' ')}&client_id=${
        settings.apps.office365.clientId
      }&redirect_uri=${appsUrl}/office365-auth-redirect${getFlowParams(
        state,
        codeChallenge
      )}`,
    redirectFunction: trpc.apps.office365.authRedirect.mutate,
  },

  // Google Calendar
  [App_Type_Enum.GoogleCalendar]: {
    icon: GoogleCalendarIcon,
    getAuthUrl: (state, codeChallenge) =>
      `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&scope=${[
        'https://www.googleapis.com/auth/userinfo.email',
        'https://www.googleapis.com/auth/calendar.readonly',
        'https://www.googleapis.com/auth/calendar.events',
      ].join(' ')}&prompt=consent&access_type=offline&client_id=${
        settings.apps.googlecalendar.clientId
      }&redirect_uri=${appsUrl}/googlecalendar-auth-redirect${getFlowParams(
        state,
        codeChallenge
      )}`,
    redirectFunction: trpc.apps.googlecalendar.authRedirect.mutate,
  },
}

interface AppParams {
  icon: React.ElementType
  getAuthUrl: (state: string, codeChallenge: string) => string
  redirectFunction: (input: {
    code: string
    codeVerifier: string
  }) => Promise<void>
}

export default appsParams
