// Without an API key, the server only answers discovery requests (initialize,
// tools/list), so clients can check the server before the key is set.
// Tools need the key: tell the assistant how to fix the connection.
export function requireUserId(userId: string | undefined): string {
  if (!userId) {
    throw new Error(
      'Missing API key. Create one in Rolebase (My account > MCP client) and send it in the x-api-key header of the connector.'
    )
  }
  return userId
}
