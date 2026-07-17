#!/usr/bin/env node

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { RolebaseClient } from './client.js'
import { registerGraphQLTool } from './tools/graphql.js'
import { registerOrgTools } from './tools/org.js'
import { registerRoleTools } from './tools/role.js'
import { registerCircleTools } from './tools/circle.js'
import { registerMemberTools } from './tools/member.js'
import { registerThreadTools } from './tools/thread.js'
import { registerMeetingTools } from './tools/meeting.js'
import { registerDecisionTools } from './tools/decision.js'
import { registerTaskTools } from './tools/task.js'
import { registerNewsTools } from './tools/news.js'
import { registerActivityTools } from './tools/activity.js'

async function main() {
  const client = new RolebaseClient()

  const server = new McpServer({
    name: 'rolebase',
    version: '1.0.0',
  })

  registerGraphQLTool(server, client)
  registerOrgTools(server, client)
  registerRoleTools(server, client)
  registerCircleTools(server, client)
  registerMemberTools(server, client)
  registerThreadTools(server, client)
  registerMeetingTools(server, client)
  registerDecisionTools(server, client)
  registerTaskTools(server, client)
  registerNewsTools(server, client)
  registerActivityTools(server, client)

  const transport = new StdioServerTransport()
  await server.connect(transport)
}

main().catch((error) => {
  console.error('Fatal error:', error)
  process.exit(1)
})
