import {
  fastifyTRPCPlugin,
  FastifyTRPCPluginOptions,
} from '@trpc/server/adapters/fastify'
import { FastifyInstance } from 'fastify'
import { TrpcRouter, trpcRouter } from '../features'
import { createContext } from './context'
import { onTrpcError } from './onTrpcError'

export function registerTrpc(app: FastifyInstance) {
  app.register(fastifyTRPCPlugin, {
    prefix: '',
    trpcOptions: {
      router: trpcRouter,
      createContext,
      onError: onTrpcError,
    } satisfies FastifyTRPCPluginOptions<TrpcRouter>['trpcOptions'],
  })
}
