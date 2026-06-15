import { RRuleUTC } from '@rolebase/shared/helpers/RRuleUTC'
import getMeetingVideoConfUrl from '@rolebase/shared/helpers/getMeetingVideoConfUrl'
import { getOrgPath } from '@rolebase/shared/helpers/getOrgPath'
import { TRPCError } from '@trpc/server'
import { utcToZonedTime } from 'date-fns-tz'
import { ICalCalendar } from 'ical-generator'
import * as yup from 'yup'
import { gql } from '../../gql'
import { guardQueryParams } from '../../guards/guardQueryParams'
import i18n from '../../i18n'
import { route } from '../../rest/route'
import settings from '../../settings'
import { adminRequest } from '../../utils/adminRequest'
import { loadOrgData } from '../org/loadOrgData'
import { generateMeetingToken } from './generateMeetingToken'

const yupSchema = yup.object().shape({
  orgId: yup.string().required(),
  token: yup.string().required(),
  memberId: yup.string().required(),
  lang: yup.string().required(),
})

export default route(async (context) => {
  const { orgId, token, memberId, lang } = guardQueryParams(context, yupSchema)

  // Validate token
  if (token !== generateMeetingToken(orgId)) {
    throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Invalid token' })
  }

  // Get org and circles
  const orgResult = await adminRequest(GET_MEETINGS, { orgId, memberId })
  const org = orgResult.org_by_pk

  if (!org) {
    throw new TRPCError({ code: 'NOT_FOUND', message: 'Org not found' })
  }

  // Load indexed org data for scope resolution
  const orgData = await loadOrgData(orgId)

  // Setup calendar
  const cal = new ICalCalendar()
  cal.name(`Réunions ${org.name}`)

  const orgUrl = `${settings.url}${getOrgPath(org)}`

  // Add events
  for (const meeting of org.meetings) {
    const url = `${orgUrl}/meetings/${meeting.id}`

    // Event title
    const summary = i18n.t('meeting.ical.title', {
      lng: lang,
      replace: {
        title: meeting.title,
        role: meeting.circle.role.name,
      },
    })

    // Event description
    const videoConf = getMeetingVideoConfUrl(meeting, meeting.circle.role.name)
    const description = i18n.t(
      videoConf
        ? 'meeting.ical.description_videoConf'
        : 'meeting.ical.description',
      {
        lng: lang,
        replace: {
          url,
          videoConf,
        },
      }
    )

    // Add event
    cal.createEvent({
      id: meeting.id,
      start: new Date(meeting.startDate),
      end: new Date(meeting.endDate),
      summary,
      description,
    })
  }

  // Filter recurring meetings
  const recurringMeetings = orgData.filterScopedEntities(
    org.meetings_recurring,
    memberId
  )

  // Add recurring events
  for (const recurringMeeting of recurringMeetings) {
    const url = `${orgUrl}/meetings-recurring/${recurringMeeting.id}`

    const rrule = new RRuleUTC(recurringMeeting.rrule)
    const nextDate = rrule.after(new Date())
    if (!nextDate) continue

    // Exclude dates of meetings from the serie
    rrule.excludeDates(recurringMeeting.meetings.map((m) => m.recurringDate))

    // Remove start date from rrule for repeating properties of ical event
    const repeating = rrule.toString().replace(/DTSTART.*\s+/, '')
    const start = formatDate(nextDate, rrule.timezone)
    const end = formatDate(
      new Date(nextDate.getTime() + recurringMeeting.duration * 60 * 1000),
      rrule.timezone
    )

    // Event title
    const summary = i18n.t('meeting.ical.title', {
      lng: lang,
      replace: {
        title: recurringMeeting.template.title,
        role: recurringMeeting.circle.role.name,
      },
    })

    // Add event
    cal.createEvent({
      id: recurringMeeting.id,
      timezone: rrule.timezone,
      start,
      end,
      repeating,
      summary,
      description: url,
    })
  }

  context.res.header('Content-Type', 'text/calendar; charset=utf-8')
  context.res.header('Content-Disposition', 'attachment; filename=meetings.ics')
  return cal.toString()
})

function formatDate(date: Date, timezone: string) {
  // return new Date(
  //   formatInTimeZone(date, timezone, "yyyyMMdd'T'HHmmss")
  // ).toISOString()
  return utcToZonedTime(date, timezone)
  //return getUTCDateFromDate(date)
}

const GET_MEETINGS = gql(`
  query getOrgMeetingsForIcal($orgId: uuid!, $memberId: uuid) {
    org_by_pk(id: $orgId) {
      id
      name
      slug
      meetings(
        where: {
          archived: { _eq: false }
          meeting_attendees: { memberId: { _eq: $memberId } }
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
      meetings_recurring {
        ...MeetingRecurring
        meetings {
          recurringDate
        }
      }
    }
  }
`)
