import { FastifyInstance } from 'fastify'
import { routes } from './registerRestRoutes'

export function registerRest(server: FastifyInstance) {
  server.register(async (app) => {
    app.addHook('onResponse', (request, reply, done) => {
      // Hide the API key of MCP URLs (/mcp/<key>)
      const url = request.url.replace(/^\/mcp\/[^/?]+/, '/mcp/***')
      console.log(`[${reply.statusCode}] ${url}`)
      done()
    })

    for (const registerRoutes of routes) {
      registerRoutes(app)
    }
  })
}
