import { calendar_v3 } from '@googleapis/calendar'
import { dateTimeToDate } from './dateTimeToDate'

export function isDateTimeEqual(
  dateTime1?: calendar_v3.Schema$EventDateTime | null | undefined,
  dateTime2?: calendar_v3.Schema$EventDateTime | null | undefined
) {
  return (
    dateTimeToDate(dateTime1)?.getTime() ===
    dateTimeToDate(dateTime2)?.getTime()
  )
}
