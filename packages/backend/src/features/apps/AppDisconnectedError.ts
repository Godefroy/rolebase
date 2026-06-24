import { captureError } from '../../utils/sentry'
import type AbstractApp from './AbstractApp'

// Thrown when an app's OAuth connection is unrecoverably broken (the user
// revoked access or the refresh token expired). It lets the trigger/webhook
// handlers tell an expected disconnection apart from a real error and skip
// reporting it to Sentry.
export class AppDisconnectedError extends Error {
  constructor(userAppId: string, cause?: string) {
    super(
      `App ${userAppId} disconnected (auth revoked)${cause ? `: ${cause}` : ''}`
    )
    this.name = 'AppDisconnectedError'
  }
}

// Detect an unrecoverable OAuth error: the user revoked access or the refresh
// token expired (after 90 days of inactivity for Microsoft). Both Google
// (googleapis) and Microsoft surface this as an `invalid_grant` response.
export function isUnrecoverableAuthError(error: unknown): boolean {
  if (error instanceof AppDisconnectedError) return true

  const haystacks: string[] = []
  const anyError = error as any
  if (typeof anyError?.message === 'string') haystacks.push(anyError.message)
  // googleapis shape: error.response.data.error === 'invalid_grant'
  const data = anyError?.response?.data
  if (typeof data === 'string') haystacks.push(data)
  if (typeof data?.error === 'string') haystacks.push(data.error)
  if (typeof data?.error_description === 'string') {
    haystacks.push(data.error_description)
  }

  return haystacks.some((haystack) => /invalid_grant/i.test(haystack))
}

// Handle an error thrown while syncing a calendar app. An unrecoverable auth
// error disconnects the app (archive + notify the user) rather than reporting
// expected, recurring noise to Sentry; any other error is reported as usual.
export async function handleAppSyncError(
  error: unknown,
  app: AbstractApp<any, any>
) {
  if (isUnrecoverableAuthError(error)) {
    await app.disconnect().catch(captureError)
  } else {
    captureError(error as Error)
  }
}
