// RRule.js needs some special transformations to dates

import { toZonedTime } from 'date-fns-tz'
import { Options, RRule, RRuleSet } from 'rrule'

export class RRuleUTC {
  public rrule: RRuleSet

  constructor(options?: Options | RRule | RRuleSet | string) {
    if (options instanceof RRuleSet) {
      this.rrule = options
      return
    }
    this.rrule = new RRuleSet()
    if (options instanceof RRule) {
      this.rrule.rrule(options)
    } else if (typeof options === 'string') {
      this.rrule.rrule(RRule.fromString(options))
    } else {
      this.rrule.rrule(new RRule(options))
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
