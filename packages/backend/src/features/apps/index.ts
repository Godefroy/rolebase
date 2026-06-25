import { TRPCError } from '@trpc/server'
import * as yup from 'yup'
import { App_Type_Enum, UserAppFullFragment, gql } from '../../gql'
import { router } from '../../trpc'
import { authedProcedure } from '../../trpc/authedProcedure'
import { adminRequest } from '../../utils/adminRequest'
import { GET_USER_APP } from './AbstractApp'
import googlecalendar from './googlecalendar'
import GoogleCalendarApp from './googlecalendar/GoogleCalendarApp'
import office365 from './office365'
import Office365App from './office365/Office365App'

export default router({
  // Install app
  uninstall: authedProcedure
    .input(
      yup.object().shape({
        id: yup.string().required(),
      })
    )
    .mutation(async (opts) => {
      const app = await loadApp(opts.input.id, opts.ctx.userId)
      await app.uninstall()
    }),

  // List app calendars
  listCalendars: authedProcedure
    .input(
      yup.object().shape({
        id: yup.string().required(),
      })
    )
    .query(async (opts) => {
      const app = await loadApp(opts.input.id, opts.ctx.userId)
      return await app.listCalendars()
    }),

  // Change app calendars selection
  selectCalendars: authedProcedure
    .input(
      yup.object().shape({
        id: yup.string().required(),
        availabilityCalendars: yup
          .array()
          .of(yup.string().required())
          .required(),
        orgsCalendars: yup
          .array()
          .of(
            yup
              .object()
              .shape({
                orgId: yup.string().required(),
                calendarId: yup.string().required(),
              })
              .required()
          )
          .required(),
      })
    )
    .mutation(async (opts) => {
      const app = await loadApp(opts.input.id, opts.ctx.userId)
      await app.selectCalendars(
        opts.input.availabilityCalendars,
        opts.input.orgsCalendars
      )
    }),

  googlecalendar,
  office365,
})

async function loadApp(id: string, userId?: string) {
  // Instanciate app
  const app = await loadAppById(id).catch((e) => {
    throw new TRPCError({ code: 'NOT_FOUND', message: 'App not found' })
  })

  // Check app ownership
  if (userId !== app.userApp.userId) {
    throw new TRPCError({ code: 'FORBIDDEN' })
  }

  return app
}

export async function loadAppById(id: string) {
  const { user_app_by_pk: userApp } = await adminRequest(GET_USER_APP, { id })
  if (!userApp) {
    throw new Error('User app not found')
  }
  return appFactory(userApp)
}

export function appFactory(userApp: UserAppFullFragment) {
  switch (userApp.type) {
    case App_Type_Enum.Office365:
      return new Office365App(userApp)
    case App_Type_Enum.GoogleCalendar:
      return new GoogleCalendarApp(userApp)
    default:
      throw new Error('Invalid app type')
  }
}

export const CREATE_USER_APP = gql(`
  mutation createUserApp($values: user_app_insert_input!) {
    insert_user_app_one(object: $values) {
      id
    }
  }
`)
