import { TRPCError } from '@trpc/server'
import { timingSafeEqual } from 'crypto'
import settings from '../settings'
import { Context } from '../trpc/context'

export function guardWebhookSecret(context: Context) {
  const { headers } = context.req

  const secretFromHeader = headers['x-nhost-webhook-secret']
  const secret = settings.webhookSecret

  // Fail closed when the secret is not configured
  if (!secret || typeof secretFromHeader !== 'string') {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'Invalid webhook secret',
    })
  }

  const expected = Buffer.from(secret)
  const received = Buffer.from(secretFromHeader)
  if (
    expected.length !== received.length ||
    !timingSafeEqual(expected, received)
  ) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'Invalid webhook secret',
    })
  }
}
