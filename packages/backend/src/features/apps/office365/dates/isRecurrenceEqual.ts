import { PatternedRecurrence } from '@microsoft/microsoft-graph-types-beta'

export function isRecurrenceEqual(
  recurrence1?: PatternedRecurrence | null,
  recurrence2?: PatternedRecurrence | null
) {
  if (recurrence1 === recurrence2) return true
  if (!recurrence1 || !recurrence2) return false
  const { pattern: pattern1, range: range1 } = recurrence1
  const { pattern: pattern2, range: range2 } = recurrence2
  if (!pattern1 || !pattern2 || !range1 || !range2) return false

  return (
    // Pattern Type
    pattern1.type === pattern2.type &&
    // Interval
    (pattern1.interval || 1) === (pattern2.interval || 1) &&
    // Month
    (pattern1.month || 0) === (pattern2.month || 0) &&
    // Day of month
    (pattern1.dayOfMonth || 0) === (pattern2.dayOfMonth || 0) &&
    // Days of week
    (pattern1.daysOfWeek || []).length === (pattern2.daysOfWeek || []).length &&
    (pattern1.daysOfWeek || [])?.every((day) =>
      pattern2.daysOfWeek?.includes(day)
    ) &&
    // First day of week
    (pattern1.firstDayOfWeek || 'sunday') ===
      (pattern2.firstDayOfWeek || 'sunday') &&
    // Index
    (pattern1.index || 'first') === (pattern2.index || 'first') &&
    // Range Type
    range1.type === range2.type &&
    // Start date
    range1.startDate === range2.startDate &&
    // End date
    (range1.endDate || '0001-01-01') === (range2.endDate || '0001-01-01') &&
    // Number of occurrences
    (range1.numberOfOccurrences || 0) === (range2.numberOfOccurrences || 0)
  )
}

/* Example of recurrence returned by MS Graph API:

{
  "pattern": {
    "type": "weekly",
    "interval": 1,
    "month": 0,
    "dayOfMonth": 0,
    "daysOfWeek": ["tuesday", "wednesday", "thursday", "friday"],
    "firstDayOfWeek": "sunday",
    "index": "first"
  },
  "range": {
    "type": "noEnd",
    "startDate": "2023-10-10",
    "endDate": "0001-01-01",
    "recurrenceTimeZone": "Romance Standard Time",
    "numberOfOccurrences": 0
  }
}

*/
