import {
  AppCalendarConfig,
  GoogleCalendarSecretConfig,
} from '@rolebase/shared/model/user_app'
import { auth } from '@googleapis/calendar'
import * as yup from 'yup'
import { CREATE_USER_APP } from '..'
import { App_Type_Enum } from '../../../gql'
import settings from '../../../settings'
import { authedProcedure } from '../../../trpc/authedProcedure'
import { adminRequest } from '../../../utils/adminRequest'

export const authRedirect = authedProcedure
  .input(
    yup.object().shape({
      code: yup.string().required(),
    })
  )
  .mutation(async (opts) => {
    const redirectUrl = `${settings.url}/apps/googlecalendar-auth-redirect`

    const oAuth2Client = new auth.OAuth2(
      settings.apps.googlecalendar.clientId,
      settings.apps.googlecalendar.clientSecret,
      redirectUrl
    )

    const tokenReponse = await oAuth2Client.getToken(opts.input.code)
    const accessToken = tokenReponse.tokens.access_token || ''

    const whoami = await oAuth2Client.getTokenInfo(accessToken)

    // Prepare secret config for storage
    const secretConfig: GoogleCalendarSecretConfig = {
      accessToken,
      refreshToken: tokenReponse.tokens.refresh_token || '',
      expiryDate: tokenReponse.tokens.expiry_date || 0,
      scope: tokenReponse.tokens.scope || '',
      subscriptions: [],
    }

    // Prepare general config for storage
    const config: AppCalendarConfig = {
      email: whoami.email || '',
      availabilityCalendars: [],
      orgsCalendars: [],
    }

    await adminRequest(CREATE_USER_APP, {
      values: {
        userId: opts.ctx.userId,
        type: App_Type_Enum.GoogleCalendar,
        secretConfig,
        config,
      },
    })
  })
