import { TRPCError } from '@trpc/server'
import {
  fastifyTRPCPlugin,
  FastifyTRPCPluginOptions,
} from '@trpc/server/adapters/fastify'
import { FastifyInstance } from 'fastify'
import { TrpcRouter, trpcRouter } from '../features'
import { captureError } from '../utils/sentry'
import { createContext } from './context'

export function registerTrpc(app: FastifyInstance) {
  app.register(fastifyTRPCPlugin, {
    prefix: '',
    trpcOptions: {
      router: trpcRouter,
      createContext,
      onError({ path, error }) {
        if (
          !(error instanceof TRPCError) ||
          error.code === 'INTERNAL_SERVER_ERROR'
        ) {
          console.error(`[Error] ${path}:`, error)
          // Report the error that was actually thrown: tRPC wraps unexpected
          // ones in a TRPCError, which would group everything together.
          const cause = error.cause instanceof Error ? error.cause : error
          captureError(cause, { path })
        }
      },
    } satisfies FastifyTRPCPluginOptions<TrpcRouter>['trpcOptions'],
  })
}
