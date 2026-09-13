// Sign-in code step kept in localStorage, so reloading the page or opening
// Rolebase again in another tab (typically after reading the email) lands on
// the code input instead of the email one. Requesting a new code would
// invalidate the one already received. Cleared once signed in or when the
// address is changed.

const KEY = 'otp-sign-in'

// Beyond this, the code has expired anyway: start over from the email step
const MAX_AGE_MS = 60 * 60 * 1000

export interface OtpSession {
  email: string
  sentAt: number
}

export function readOtpSession(): OtpSession | undefined {
  try {
    const session: OtpSession = JSON.parse(localStorage.getItem(KEY) || '')
    if (!session.email || Date.now() - session.sentAt > MAX_AGE_MS) {
      localStorage.removeItem(KEY)
      return
    }
    return session
  } catch {
    return
  }
}

export function writeOtpSession(session: OtpSession) {
  try {
    localStorage.setItem(KEY, JSON.stringify(session))
  } catch {
    // Storage unavailable (private mode): the step only lives in memory
  }
}

export function clearOtpSession() {
  try {
    localStorage.removeItem(KEY)
  } catch {
    // Nothing to clear
  }
}
