import { fromZonedTime } from 'date-fns-tz'
import { calendar_v3 } from '@googleapis/calendar'

export function dateTimeToDate(
  dateTime: calendar_v3.Schema$EventDateTime | null | undefined
) {
  if (!dateTime?.dateTime) return undefined
  return fromZonedTime(
    new Date(dateTime.dateTime.substring(0, 19)),
    dateTime.timeZone || 'UTC'
  )
}
