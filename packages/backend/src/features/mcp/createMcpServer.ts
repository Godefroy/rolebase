import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { readFileSync } from 'fs'
import { join } from 'path'
import { Context } from '../../trpc/context'
import { registerGraphqlTools } from './tools/registerGraphqlTools'
import { registerTrpcTools } from './tools/registerTrpcTools'

// Sent to clients on initialization: the Rolebase guide, shared with the
// Rolebase skill so both stay in sync, followed by the MCP tools.
const instructions = [
  join(
    __dirname,
    '../../../../../plugins/rolebase/skills/rolebase/reference.md'
  ),
  join(__dirname, 'instructions.md'),
]
  .map((path) => readFileSync(path, 'utf8'))
  .join('\n')

// The tools are generic on purpose: they expose the GraphQL schema and the
// tRPC router as they are, so the MCP server follows the API without upkeep.
export function createMcpServer(ctx: Context & { userId: string }) {
  const server = new McpServer(
    { name: 'rolebase', version: '1.0.0' },
    { instructions }
  )
  registerGraphqlTools(server, ctx.userId)
  registerTrpcTools(server, ctx)
  return server
}
