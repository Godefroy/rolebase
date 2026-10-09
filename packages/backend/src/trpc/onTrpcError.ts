import { TRPCError } from '@trpc/server'
import { captureError } from '../utils/sentry'

// Log and report unexpected errors. Shared by the HTTP adapter
// and the MCP server's caller.
export function onTrpcError({
  path,
  error,
}: {
  path?: string
  error: TRPCError
}) {
  if (!(error instanceof TRPCError) || error.code === 'INTERNAL_SERVER_ERROR') {
    console.error(`[Error] ${path}:`, error)
    // Report the error that was actually thrown: tRPC wraps unexpected
    // ones in a TRPCError, which would group everything together.
    const cause = error.cause instanceof Error ? error.cause : error
    captureError(cause, { path })
  }
}
