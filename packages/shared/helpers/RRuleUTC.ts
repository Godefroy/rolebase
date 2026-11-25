// RRule.js needs some special transformations to dates

import { toZonedTime } from 'date-fns-tz'
import { Frequency, Options, RRule, RRuleSet } from 'rrule'

// Rules come from user input and rrule iterates synchronously from DTSTART
// with no bound of its own, so every rule is checked before evaluation
const minDtstart = Date.UTC(2000, 0, 1)
const maxInterval = 1000
const maxTimesPerDay = 24
const maxStringLength = 2000
const maxYear = 9999 // Year where rrule stops iterating
const timeParts = ['byhour', 'byminute', 'bysecond'] as const
const timePartMax = { byhour: 23, byminute: 59, bysecond: 59 }
const commonParts = [
  'freq',
  'dtstart',
  'interval',
  'wkst',
  'count',
  'until',
  'tzid',
]

// Parts allowed per frequency. DAILY (with INTERVAL=1) and WEEKLY rules
// built from these parts always produce occurrences. MONTHLY and YEARLY
// rules are also probed, because they can never match (e.g. February 30th),
// which makes rrule iterate until year 9999.
const allowedParts: Partial<Record<Frequency, string[]>> = {
  [Frequency.DAILY]: ['byweekday', ...timeParts],
  [Frequency.WEEKLY]: ['byweekday', ...timeParts],
  [Frequency.MONTHLY]: ['bymonthday', 'byweekday', 'bysetpos', ...timeParts],
  [Frequency.YEARLY]: [
    'bymonth',
    'bymonthday',
    'byweekday',
    'bysetpos',
    ...timeParts,
  ],
}

export class RRuleValidationError extends Error {
  constructor(message: string) {
    super(`Invalid RRULE: ${message}`)
    this.name = 'RRuleValidationError'
  }
}

// Parse a user-provided RRULE string and check it is safe to evaluate
export function parseSafeRRule(value: unknown): RRule {
  if (typeof value !== 'string') {
    throw new RRuleValidationError('not a string')
  }
  if (value.length > maxStringLength) {
    throw new RRuleValidationError('too long')
  }
  const rrule = RRule.fromString(value)
  validateRRule(rrule)
  return rrule
}

// Throw if a rule could make rrule iterate for too long
export function validateRRule(rrule: RRule) {
  const { freq, dtstart, interval, byweekday } = rrule.options
  const allowed = allowedParts[freq]
  if (!allowed) {
    throw new RRuleValidationError('frequency not allowed')
  }
  for (const [key, value] of Object.entries(rrule.origOptions)) {
    if (!isSet(value)) continue
    if (!commonParts.includes(key) && !allowed.includes(key)) {
      throw new RRuleValidationError(`${key} not allowed with this frequency`)
    }
  }
  if (!(dtstart instanceof Date) || isNaN(dtstart.getTime())) {
    throw new RRuleValidationError('invalid DTSTART')
  }
  if (dtstart.getTime() < minDtstart) {
    throw new RRuleValidationError('DTSTART is too far in the past')
  }
  if (!Number.isInteger(interval) || interval < 1 || interval > maxInterval) {
    throw new RRuleValidationError('invalid INTERVAL')
  }
  if (byweekday?.some((day) => !Number.isInteger(day) || day < 0 || day > 6)) {
    throw new RRuleValidationError('invalid BYDAY')
  }
  // DAILY with an INTERVAL visits only some weekdays
  if (
    freq === Frequency.DAILY &&
    interval > 1 &&
    isSet(rrule.origOptions.byweekday)
  ) {
    throw new RRuleValidationError('BYDAY not allowed with DAILY and INTERVAL')
  }
  const timesPerDay = timeParts.reduce((total, part) => {
    const values = rrule.options[part]
    if (
      values?.some(
        (v) => !Number.isInteger(v) || v < 0 || v > timePartMax[part]
      )
    ) {
      throw new RRuleValidationError(`invalid ${part}`)
    }
    return total * (values?.length || 1)
  }, 1)
  if (timesPerDay > maxTimesPerDay) {
    throw new RRuleValidationError('too many occurrences per day')
  }
  if (freq === Frequency.MONTHLY || freq === Frequency.YEARLY) {
    probeRRule(rrule)
  }
}

// Check that a rule produces at least one occurrence, with a bounded number
// of iterations. The rule is evaluated from a copy of DTSTART moved by a
// multiple of 400 years (the Gregorian calendar repeats every 400 years) to
// near year 9999, so iteration stops at year 9999 even if nothing matches.
function probeRRule(rrule: RRule) {
  const { dtstart } = rrule.options
  const year = dtstart.getUTCFullYear()
  const shift = Math.floor((maxYear - 30 - year) / 400) * 400
  const probeStart = new Date(dtstart.getTime())
  probeStart.setUTCFullYear(year + shift)
  const probe = new RRule({
    ...rrule.origOptions,
    dtstart: probeStart,
    tzid: undefined,
    count: undefined,
    until: undefined,
  })
  if (!probe.after(probeStart, true)) {
    throw new RRuleValidationError('rule never produces an occurrence')
  }
}

function isSet(value: unknown) {
  return (
    value !== null &&
    value !== undefined &&
    !(Array.isArray(value) && value.length === 0)
  )
}

export class RRuleUTC {
  public rrule: RRuleSet

  constructor(options?: Options | RRule | RRuleSet | string) {
    if (options instanceof RRuleSet) {
      options._rrule.forEach(validateRRule)
      options._exrule.forEach(validateRRule)
      this.rrule = options
      return
    }
    this.rrule = new RRuleSet()
    if (options instanceof RRule) {
      validateRRule(options)
      this.rrule.rrule(options)
    } else if (typeof options === 'string') {
      this.rrule.rrule(parseSafeRRule(options))
    } else {
      const rrule = new RRule(options)
      validateRRule(rrule)
      this.rrule.rrule(rrule)
    }
  }

  get mainRrule() {
    return this.rrule._rrule[0]
  }

  get timezone(): string {
    return this.rrule.tzid() || 'UTC'
  }

  toString() {
    return this.rrule.toString()
  }

  after(date: Date | string, inc?: boolean) {
    const d = date instanceof Date ? date : new Date(date)
    const dateTZ = this.rrule.after(getUTCDateFromDate(d), inc)
    if (!dateTZ) return null
    return getDateFromUTCDate(dateTZ)
  }

  before(date: Date | string, inc?: boolean) {
    const d = date instanceof Date ? date : new Date(date)
    const dateTZ = this.rrule.before(getUTCDateFromDate(d), inc)
    if (!dateTZ) return null
    return getDateFromUTCDate(dateTZ)
  }

  between(
    after: Date | string,
    before: Date | string,
    inc?: boolean | undefined,
    iterator?: ((d: Date, len: number) => boolean) | undefined
  ) {
    const afterDate = after instanceof Date ? after : new Date(after)
    const beforeDate = before instanceof Date ? before : new Date(before)
    return this.rrule
      .between(
        getUTCDateFromDate(afterDate),
        getUTCDateFromDate(beforeDate),
        inc,
        iterator
      )
      .map((date) => getDateFromUTCDate(date))
  }

  changeStartDate(date: Date) {
    for (const i in this.rrule._rrule) {
      const rrule = this.rrule._rrule[i]
      if (rrule.origOptions.dtstart) {
        this.rrule._rrule[i] = new RRule({
          ...rrule.origOptions,
          dtstart: getUTCDateFromDate(toZonedTime(date, this.timezone)),
        })
        return
      }
    }
  }

  excludeDates(dates: Array<Date | string | null | undefined>) {
    // Exclude dates of meetings from the serie
    for (const dateStr of dates) {
      if (!dateStr) continue
      const date = dateStr instanceof Date ? dateStr : new Date(dateStr)
      this.rrule.exdate(getUTCDateFromDate(toZonedTime(date, this.timezone)))
    }
  }
}

export function getDateFromUTCDate(date: Date): Date {
  return new Date(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate(),
    date.getUTCHours(),
    date.getUTCMinutes(),
    date.getUTCSeconds()
  )
}

export function getUTCDateFromDate(date: Date): Date {
  return new Date(
    Date.UTC(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      date.getHours(),
      date.getMinutes(),
      date.getSeconds()
    )
  )
}
