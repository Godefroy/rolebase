import { publicProcedure } from '.'
import { guardAdmin } from '../guards/guardAdmin'

export const adminProcedure = publicProcedure
  .meta({ internal: true })
  .use((opts) => {
    guardAdmin(opts.ctx)
    return opts.next()
  })
