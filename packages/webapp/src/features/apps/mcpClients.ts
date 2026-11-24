import type { ParseKeys } from 'i18next'

// Clients with steps in McpPage.clients
type McpClientWithStepsId =
  'claude' | 'chatgpt' | 'mistral' | 'codex' | 'vscode'

export interface McpSnippet {
  // Translation key of the label shown above the snippet
  labelKey: ParseKeys
  getCode: (serverUrl: string, apiKey: string) => string
  // The snippet holds the API key: show a warning below it
  keyInUrl?: boolean
}

// Steps before the snippets, in McpPage.clients.<id>.steps
export type McpClient = McpClientBase &
  (
    | { id: McpClientWithStepsId; hasSteps: true }
    | { id: 'claudeCode' | 'cursor'; hasSteps?: false }
  )

interface McpClientBase {
  name: string
  // Link opened by <a> in the steps
  stepsLink?: string
  // Shown below the snippets
  noteKey?: ParseKeys
  snippets: McpSnippet[]
  // Developer tool, documented in the developers section
  isDevTool?: boolean
}

const serverUrlSnippet: McpSnippet = {
  labelKey: 'McpPage.serverUrl',
  getCode: (serverUrl) => `${serverUrl}/mcp`,
}

const apiKeySnippet: McpSnippet = {
  labelKey: 'McpPage.apiKey',
  getCode: (_, apiKey) => apiKey,
}

export const mcpClients: McpClient[] = [
  {
    id: 'claude',
    hasSteps: true,
    name: 'Claude',
    stepsLink: 'https://claude.ai/customize/connectors',
    noteKey: 'McpPage.clients.claude.note',
    snippets: [serverUrlSnippet, apiKeySnippet],
  },
  {
    id: 'chatgpt',
    hasSteps: true,
    name: 'ChatGPT',
    noteKey: 'McpPage.clients.chatgpt.note',
    snippets: [
      {
        labelKey: 'McpPage.urlWithKey',
        getCode: (serverUrl, apiKey) => `${serverUrl}/mcp/${apiKey}`,
        keyInUrl: true,
      },
    ],
  },
  {
    id: 'mistral',
    hasSteps: true,
    name: 'Mistral Vibe',
    snippets: [serverUrlSnippet, apiKeySnippet],
  },
  {
    id: 'claudeCode',
    name: 'Claude Code',
    isDevTool: true,
    snippets: [
      {
        labelKey: 'McpPage.command',
        getCode: (serverUrl, apiKey) =>
          `claude mcp add --transport http rolebase ${serverUrl}/mcp \\\n  --header "x-api-key: ${apiKey}"`,
      },
    ],
  },
  {
    id: 'codex',
    hasSteps: true,
    name: 'Codex',
    isDevTool: true,
    snippets: [
      {
        labelKey: 'McpPage.codexConfig',
        getCode: (serverUrl) =>
          `[mcp_servers.rolebase]\nurl = "${serverUrl}/mcp"\nenv_http_headers = { "x-api-key" = "ROLEBASE_API_KEY" }`,
      },
      {
        labelKey: 'McpPage.codexEnv',
        getCode: (_, apiKey) => `export ROLEBASE_API_KEY="${apiKey}"`,
      },
    ],
  },
  {
    id: 'cursor',
    name: 'Cursor',
    isDevTool: true,
    snippets: [
      {
        labelKey: 'McpPage.cursorConfig',
        getCode: (serverUrl, apiKey) =>
          JSON.stringify(
            {
              mcpServers: {
                rolebase: {
                  url: `${serverUrl}/mcp`,
                  headers: { 'x-api-key': apiKey },
                },
              },
            },
            null,
            2
          ),
      },
    ],
  },
  {
    id: 'vscode',
    hasSteps: true,
    name: 'VS Code',
    isDevTool: true,
    snippets: [
      {
        labelKey: 'McpPage.vscodeConfig',
        getCode: (serverUrl) =>
          JSON.stringify(
            {
              inputs: [
                {
                  type: 'promptString',
                  id: 'rolebase-api-key',
                  description: 'Rolebase API key',
                  password: true,
                },
              ],
              servers: {
                rolebase: {
                  type: 'http',
                  url: `${serverUrl}/mcp`,
                  headers: { 'x-api-key': '${input:rolebase-api-key}' },
                },
              },
            },
            null,
            2
          ),
      },
      apiKeySnippet,
    ],
  },
]
