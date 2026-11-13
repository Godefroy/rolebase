import { RestError, route } from '../../rest/route'
import settings from '../../settings'
import { captureError } from '../../utils/sentry'
import { deleteBouncedAccount } from './utils/deleteBouncedAccount'
import { recordBounce } from './utils/emailBounces'

// Brevo transactional events meaning the address can't receive emails:
// unknown mailbox or domain, or blocked by Brevo after such a bounce
const UNDELIVERABLE_EVENTS = ['hard_bounce', 'blocked', 'invalid_email']

interface BrevoEvent {
  event?: string
  email?: string
  ts_event?: number
}

// Webhook called by Brevo on transactional email events, authenticated with
// a token sent as a bearer header or in the URL (`?token=`), whichever the
// Brevo configuration allows. Brevo sends one event per call, or an array
// when batching is enabled.
export default route((context) => {
  const token = settings.brevoWebhookToken
  const query = context.req.query as { token?: string } | undefined
  const received =
    query?.token ||
    context.req.headers.authorization?.replace(/^Bearer /, '') ||
    undefined
  if (!token || received !== token) {
    throw new RestError(401, 'Invalid token')
  }

  const body = context.req.body as BrevoEvent | BrevoEvent[] | undefined
  const events = Array.isArray(body) ? body : body ? [body] : []
  for (const { event, email, ts_event } of events) {
    if (!email || !event || !UNDELIVERABLE_EVENTS.includes(event)) continue
    recordBounce(email, ts_event ? ts_event * 1000 : Date.now())
    // Answered right away: Brevo doesn't wait for the cleanup
    deleteBouncedAccount(email).catch(captureError)
  }
  return 'OK'
})
