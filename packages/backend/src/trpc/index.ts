import { initTRPC } from '@trpc/server'
import settings from '../settings'
import { Context } from './context'

export interface Meta {
  // Reserved to webhooks, scheduled jobs and admins: hidden from the MCP server
  internal?: boolean
}

// Init tRPC
// isDev controls whether error responses include the stack trace
const t = initTRPC
  .context<Context>()
  .meta<Meta>()
  .create({
    isDev: settings.isDev,
    errorFormatter({ shape, error }) {
      // Unexpected errors carry internal details (database, third-party APIs) in
      // their message. The server logs keep the original one.
      if (!settings.isDev && error.code === 'INTERNAL_SERVER_ERROR') {
        return { ...shape, message: 'Internal Server Error' }
      }
      return shape
    },
  })

// Router
export const router = t.router

// Server-side caller, used by the MCP server
export const createCallerFactory = t.createCallerFactory

// Public procedure with logging
export const publicProcedure = t.procedure.use(async (opts) => {
  const start = Date.now()

  const result = await opts.next()

  const durationMs = Date.now() - start

  console.log(`[${result.ok ? 'OK' : 'KO'}] ${opts.path} (${durationMs}ms)`)
  return result
})
