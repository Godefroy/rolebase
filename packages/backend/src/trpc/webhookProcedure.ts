import { publicProcedure } from '.'
import { guardWebhookSecret } from '../guards/guardWebhookSecret'

export const webhookProcedure = publicProcedure
  .meta({ internal: true })
  .use((opts) => {
    guardWebhookSecret(opts.ctx)
    return opts.next()
  })
