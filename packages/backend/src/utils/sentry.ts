import * as Sentry from '@sentry/node'
import settings from '../settings'

Sentry.init({
  dsn: settings.sentry.dsn,
  // Performance Monitoring (sampled to limit memory and CPU overhead)
  tracesSampleRate: 0.1,
})

export function startErrorHandling(name: string) {
  return Sentry.startInactiveSpan({ name, op: 'http.server' })
}

export function captureError(error: Error, extra?: Record<string, unknown>) {
  Sentry.captureException(error, extra ? { extra } : undefined)
}
