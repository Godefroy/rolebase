import { describe, expect, it } from 'vitest'
import { MeetingFragment } from '../gql'
import { VideoConfTypes } from '../model/meeting'
import getMeetingVideoConfUrl from './getMeetingVideoConfUrl'

const meetingWithUrl = (url: string) =>
  ({ videoConf: { type: VideoConfTypes.Url, url } }) as MeetingFragment

describe('getMeetingVideoConfUrl', () => {
  it('returns http(s) URLs', () => {
    expect(getMeetingVideoConfUrl(meetingWithUrl('https://meet.example.com/a'))).toBe(
      'https://meet.example.com/a'
    )
    expect(getMeetingVideoConfUrl(meetingWithUrl('http://localhost:8080'))).toBe(
      'http://localhost:8080'
    )
  })

  it('ignores other schemes and invalid URLs', () => {
    for (const url of [
      'javascript:alert(document.domain)',
      ' JavaScript:alert(1)',
      'data:text/html,<script>alert(1)</script>',
      'meet.example.com/a',
      '',
    ]) {
      expect(getMeetingVideoConfUrl(meetingWithUrl(url))).toBeUndefined()
    }
  })
})
