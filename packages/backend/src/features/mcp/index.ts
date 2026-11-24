import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js'
import { FastifyRequest } from 'fastify'
import { registerRestRoutes } from '../../rest/registerRestRoutes'
import { Context, createContext } from '../../trpc/context'
import { authenticateApiKey } from '../../utils/authenticateApiKey'
import { createMcpServer } from './createMcpServer'

// MCP server for AI assistants, over Streamable HTTP.
// Stateless: each request gets its own server, scoped to the user of the
// API key, like the GraphQL and tRPC APIs. The key is read from:
// - the x-api-key header
// - "Authorization: Bearer", the only option of some assistants
// - the URL (/mcp/<key>), for assistants that only connect without
//   authentication or with OAuth, like ChatGPT
// Without a key, discovery works but tools answer with an error: clients
// like Claude check the server before the key is entered.

registerRestRoutes(async (app) => {
  app.post('/mcp', async (req, res) => {
    const ctx = await createContext({ req, res })
    const userId = ctx.userId ?? (await getBearerApiKeyUserId(req))
    await handleMcpRequest(ctx, userId, hasApiKey(req))
  })

  app.post<{ Params: { apiKey: string } }>('/mcp/:apiKey', async (req, res) => {
    const ctx = await createContext({ req, res })
    const userId = await authenticateApiKey(req.params.apiKey).catch(
      () => undefined
    )
    await handleMcpRequest(ctx, userId, true)
  })

  // No SSE stream nor session to close in stateless mode
  app.route({
    method: ['GET', 'DELETE'],
    url: '/mcp/:apiKey?',
    handler: async (req, res) => {
      res.status(405).header('Allow', 'POST').send(jsonRpcError('Use POST'))
    },
  })
})

async function handleMcpRequest(
  ctx: Context,
  userId: string | undefined,
  withApiKey: boolean
) {
  const { req, res } = ctx
  if (withApiKey && !userId) {
    // Not 401 nor 403: MCP clients take both as a call for OAuth, which
    // this server doesn't support, and hide this message
    res.status(400).send(jsonRpcError('Missing or invalid API key'))
    return
  }

  const server = createMcpServer({ ...ctx, isAuthenticated: !!userId, userId })
  const transport = new StreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
    enableJsonResponse: true,
  })

  // The transport writes the response itself: keep the headers already
  // set by Fastify hooks (CORS)
  res.hijack()
  for (const [name, value] of Object.entries(res.getHeaders())) {
    if (value !== undefined) res.raw.setHeader(name, value)
  }
  res.raw.on('close', () => {
    transport.close()
    server.close()
  })

  await server.connect(transport)
  await transport.handleRequest(req.raw, res.raw, req.body)
}

function jsonRpcError(message: string) {
  return { jsonrpc: '2.0', error: { code: -32000, message }, id: null }
}

function hasApiKey(req: FastifyRequest) {
  return !!req.headers['x-api-key'] || !!req.headers.authorization
}

// The context already handles a bearer access token: try it as an API key
async function getBearerApiKeyUserId(req: FastifyRequest) {
  const token = req.headers.authorization?.match(/^Bearer (.+)$/)?.[1]
  if (!token) return undefined
  return authenticateApiKey(token).catch(() => undefined)
}
