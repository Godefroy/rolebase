import * as crypto from 'crypto'
import settings from '../../settings'

// Token of the iCal feed of a member, bound to both the org and the member
export function generateMeetingToken(orgId: string, memberId: string) {
  const secret = settings.security.invitation_token
  if (!secret) {
    throw new Error('SECURITY_INVITATION_TOKEN env var is not set')
  }
  return crypto
    .createHmac('sha256', secret)
    .update(`meeting-ical:${orgId}:${memberId}`)
    .digest('hex')
}

export function isMeetingTokenValid(
  token: string,
  orgId: string,
  memberId: string
): boolean {
  const expected = Buffer.from(generateMeetingToken(orgId, memberId))
  const actual = Buffer.from(token)
  return (
    actual.length === expected.length &&
    crypto.timingSafeEqual(actual, expected)
  )
}
