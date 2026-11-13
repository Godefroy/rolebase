import { useEffect, useState } from 'react'
import { track } from 'src/analytics'
import { trpc } from 'src/trpc'

// A bounce comes back within seconds: past this delay, polling stops
const POLL_DURATION_MS = 2 * 60 * 1000
const POLL_INTERVAL_MS = 5000

// Whether the sign-in code sent to `email` at `sentAt` bounced (unknown
// mailbox or domain), polled while the code step is shown
export default function useEmailBounce(email: string, sentAt: number) {
  const [bounced, setBounced] = useState(false)

  useEffect(() => {
    setBounced(false)
    if (!email || !sentAt) return

    let stopped = false
    const check = async () => {
      if (stopped) return
      if (Date.now() - sentAt > POLL_DURATION_MS) {
        clearInterval(interval)
        return
      }
      try {
        // A bounce dated slightly before the send (clock skew) still counts
        const result = await trpc.user.checkEmailDelivery.query({
          email,
          since: sentAt - 60 * 1000,
        })
        if (result.bounced && !stopped) {
          stopped = true
          clearInterval(interval)
          track('auth_otp_bounced')
          setBounced(true)
        }
      } catch {
        // Unreachable backend: no hint, the code may still arrive
      }
    }
    const interval = setInterval(check, POLL_INTERVAL_MS)
    check()
    return () => {
      stopped = true
      clearInterval(interval)
    }
  }, [email, sentAt])

  return bounced
}
