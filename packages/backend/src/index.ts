import fastify from 'fastify'
import { registerCollab } from './features/collab/registerCollab'
import { registerRest } from './rest/registerRest'
import settings from './settings'
import { registerTrpc } from './trpc/registerTrpc'

// Create Fastify server
const server = fastify()

// Add pre-handler hook for CORS
server.addHook('preHandler', async (req, res) => {
  // Set default headers
  res.header('Access-Control-Allow-Credentials', 'true')
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', '*')
  res.header('Access-Control-Allow-Methods', '*')

  // Enable CORS for OPTIONS
  if (req.method === 'OPTIONS') {
    res.status(204).send()
    return
  }
})

// Register tRPC
registerTrpc(server)

// Register REST routes
registerRest(server)

// Register collaborative editing (WebSocket)
registerCollab(server)

// Start server
server
  .listen({
    port: settings.port,
    host: '0.0.0.0',
  })
  .then(() => {
    console.log(`Listening to port ${settings.port}`)
  })
  .catch((err) => {
    server.log.error(err)
    process.exit(1)
  })
