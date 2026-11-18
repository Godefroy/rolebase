import { describe, expect, it } from 'vitest'
import { RRule } from 'rrule'
import { getDefaultDigestRRule } from '../model/notifications'
import { parseSafeRRule, RRuleUTC, RRuleValidationError } from './RRuleUTC'

// RRule tests
// London : UTC+0 before March 30th, then UTC+1
// Kiev : UTC+2 before March 30th, then UTC+3
const rruleLondon = `DTSTART;TZID=Europe/London:20240311T100000
RRULE:FREQ=WEEKLY;INTERVAL=1;BYDAY=MO,TU,WE,TH,FR`
const rruleKiev = `DTSTART;TZID=Europe/Kiev:20240311T100000
RRULE:FREQ=WEEKLY;INTERVAL=1;BYDAY=MO,TU,WE,TH,FR`

describe('rrule', () => {
  it('next date London', () => {
    const rrule = new RRuleUTC(rruleLondon)
    expect(rrule.after('2024-04-01T08:59:00.000Z')?.toISOString()).toEqual(
      '2024-04-01T09:00:00.000Z'
    )
    expect(rrule.after('2024-04-01T09:01:00.000Z')?.toISOString()).toEqual(
      '2024-04-02T09:00:00.000Z'
    )
  })

  it('next date Kiev', () => {
    const rrule = new RRuleUTC(rruleKiev)
    expect(rrule.after('2024-04-01T06:59:00.000Z')?.toISOString()).toEqual(
      '2024-04-01T07:00:00.000Z'
    )
    expect(rrule.after('2024-04-01T07:01:00.000Z')?.toISOString()).toEqual(
      '2024-04-02T07:00:00.000Z'
    )
  })

  it('change start date London', () => {
    const rrule = new RRuleUTC(rruleLondon)
    const nextDate = rrule.after('2024-04-01T08:59:00.000Z') || new Date()
    rrule.changeStartDate(nextDate)
    expect(rrule.toString()).toEqual(
      rruleLondon.replace('20240311', '20240401')
    )
  })

  it('change start date Kiev', () => {
    const rrule = new RRuleUTC(rruleKiev)
    const nextDate = rrule.after('2024-04-01T06:59:00.000Z') || new Date()
    rrule.changeStartDate(nextDate)
    expect(rrule.toString()).toEqual(rruleKiev.replace('20240311', '20240401'))
  })

  it('exclude meetings London', () => {
    const rrule = new RRuleUTC(rruleLondon)
    const dates = ['2024-03-13T10:00:00.000Z', '2024-03-14T10:00:00.000Z']
    rrule.excludeDates(dates)
    expect(
      rrule
        .between('2024-03-12T09:59:00.000Z', '2024-03-15T10:01:00.000Z')
        .map((date) => date.toISOString())
    ).toEqual(['2024-03-12T10:00:00.000Z', '2024-03-15T10:00:00.000Z'])
  })

  it('exclude meetings Kiev', () => {
    const rrule = new RRuleUTC(rruleKiev)
    rrule.excludeDates(['2024-03-13T08:00:00.000Z', '2024-03-14T08:00:00.000Z'])
    expect(
      rrule
        .between('2024-03-12T07:59:00.000Z', '2024-03-15T08:01:00.000Z')
        .map((date) => date.toISOString())
    ).toEqual(['2024-03-12T08:00:00.000Z', '2024-03-15T08:00:00.000Z'])
  })
})

describe('rrule safety', () => {
  const reject = [
    ['secondly', 'DTSTART:20250101T000000Z\nRRULE:FREQ=SECONDLY'],
    ['minutely', 'DTSTART:20250101T000000Z\nRRULE:FREQ=MINUTELY'],
    ['hourly', 'DTSTART:20250101T000000Z\nRRULE:FREQ=HOURLY'],
    ['far past DTSTART', 'DTSTART:19000101T000000Z\nRRULE:FREQ=DAILY'],
    [
      'too many times per day',
      'DTSTART:20250101T000000Z\nRRULE:FREQ=DAILY;BYHOUR=0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23;BYMINUTE=0,30',
    ],
    ['huge interval', 'DTSTART:20250101T000000Z\nRRULE:FREQ=DAILY;INTERVAL=100000'],
    ['unknown property', 'X=1'],
  ]

  it.each(reject)('rejects %s', (_, value) => {
    expect(() => new RRuleUTC(value)).toThrow()
  })

  it('rejects non-string values', () => {
    expect(() => parseSafeRRule({})).toThrow(RRuleValidationError)
    expect(() => parseSafeRRule(1)).toThrow(RRuleValidationError)
    expect(() => parseSafeRRule('a'.repeat(3000))).toThrow(RRuleValidationError)
  })

  it('rejects dangerous RRule instances', () => {
    expect(
      () =>
        new RRuleUTC(
          new RRule({ freq: RRule.SECONDLY, dtstart: new Date('2025-01-01') })
        )
    ).toThrow(RRuleValidationError)
  })

  it('accepts rules produced by the editor', () => {
    expect(() => new RRuleUTC(rruleLondon)).not.toThrow()
    for (const freq of [RRule.DAILY, RRule.WEEKLY, RRule.MONTHLY, RRule.YEARLY]) {
      const value = new RRule({
        freq,
        interval: 2,
        tzid: 'Europe/Paris',
        dtstart: new Date(Date.UTC(2023, 5, 1, 9, 30)),
      }).toString()
      expect(() => parseSafeRRule(value)).not.toThrow()
    }
    expect(() =>
      parseSafeRRule(getDefaultDigestRRule('2021-03-04T10:00:00Z').toString())
    ).not.toThrow()
  })

  it('rejects rules that never match, quickly', () => {
    const start = Date.now()
    for (const value of [
      'DTSTART:20200101T000000Z\nRRULE:FREQ=MONTHLY;BYMONTHDAY=30;BYSETPOS=2',
      'DTSTART:20200101T000000Z\nRRULE:FREQ=MONTHLY;BYSETPOS=10;BYDAY=MO',
      'DTSTART:20200101T000000Z\nRRULE:FREQ=YEARLY;BYMONTH=2;BYMONTHDAY=30',
      'DTSTART:20200131T000000Z\nRRULE:FREQ=YEARLY;BYMONTH=2',
    ]) {
      expect(() => new RRuleUTC(value)).toThrow(RRuleValidationError)
    }
    expect(Date.now() - start).toBeLessThan(1000)
  })

  it('rejects parts that can prevent DAILY and WEEKLY rules from matching', () => {
    for (const value of [
      'DTSTART:20200101T000000Z\nRRULE:FREQ=DAILY;BYMONTH=2;BYMONTHDAY=30',
      'DTSTART:20200101T000000Z\nRRULE:FREQ=WEEKLY;BYMONTHDAY=30',
      'DTSTART:20200101T000000Z\nRRULE:FREQ=DAILY;BYYEARDAY=366',
      'DTSTART:20200106T000000Z\nRRULE:FREQ=DAILY;INTERVAL=7;BYDAY=TU',
      'DTSTART:20200101T000000Z\nRRULE:FREQ=MONTHLY;BYWEEKNO=60',
    ]) {
      expect(() => new RRuleUTC(value)).toThrow(RRuleValidationError)
    }
  })

  it('accepts monthly and yearly rules produced by the editor', () => {
    const dtstart = new Date(Date.UTC(2023, 5, 1, 9, 30))
    const values = [
      new RRule({ freq: RRule.MONTHLY, dtstart, bymonthday: [31] }),
      new RRule({ freq: RRule.MONTHLY, dtstart, bysetpos: [-1], byweekday: [4] }),
      new RRule({ freq: RRule.MONTHLY, dtstart, bysetpos: [2], byweekday: [0] }),
      new RRule({ freq: RRule.YEARLY, dtstart, bymonth: [12] }),
      new RRule({
        freq: RRule.WEEKLY,
        dtstart,
        tzid: 'Europe/Paris',
        byweekday: [RRule.MO, RRule.WE],
      }),
    ].map((rrule) => rrule.toString())
    for (const value of values) {
      expect(() => new RRuleUTC(value)).not.toThrow()
    }
  })

  it('finds previous and next occurrences', () => {
    const rrule = new RRuleUTC(
      'DTSTART;TZID=Europe/London:20200106T100000\nRRULE:FREQ=WEEKLY;BYDAY=MO'
    )
    expect(rrule.before('2024-04-03T00:00:00.000Z')?.toISOString()).toEqual(
      '2024-04-01T09:00:00.000Z'
    )
    expect(rrule.after('2024-04-03T00:00:00.000Z')?.toISOString()).toEqual(
      '2024-04-08T09:00:00.000Z'
    )
    expect(
      rrule.after('2024-04-08T09:00:00.000Z', true)?.toISOString()
    ).toEqual('2024-04-08T09:00:00.000Z')
  })
})
