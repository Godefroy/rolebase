import { CallToolResult } from '@modelcontextprotocol/sdk/types.js'

// Wrap a tool output: strings as is, anything else as JSON
export function textResult(value: unknown): CallToolResult {
  const text =
    typeof value === 'string' ? value : JSON.stringify(value, null, 2)
  return { content: [{ type: 'text', text }] }
}
