import * as Sentry from '@sentry/node'
import { nodeProfilingIntegration } from '@sentry/profiling-node'
import settings from '../settings'

Sentry.init({
  dsn: settings.sentry.dsn,
  integrations: [nodeProfilingIntegration()],
  // Performance Monitoring
  tracesSampleRate: 1.0,
  // Set sampling rate for profiling - this is relative to tracesSampleRate
  profilesSampleRate: 1.0,
})

export function startErrorHandling(name: string) {
  return Sentry.startInactiveSpan({ name, op: 'http.server' })
}

export function captureError(error: Error, extra?: Record<string, unknown>) {
  Sentry.captureException(error, extra ? { extra } : undefined)
}
