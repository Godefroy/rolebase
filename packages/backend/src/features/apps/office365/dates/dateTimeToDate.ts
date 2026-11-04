import { DateTimeTimeZone } from '@microsoft/microsoft-graph-types-beta'
import { fromZonedTime } from 'date-fns-tz'

export function dateTimeToDate(dateTime: DateTimeTimeZone | null | undefined) {
  if (!dateTime?.dateTime) return undefined
  return fromZonedTime(new Date(dateTime.dateTime), dateTime.timeZone || 'UTC')
}
