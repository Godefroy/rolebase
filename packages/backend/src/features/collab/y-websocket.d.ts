// y-websocket 1.x server utils ship without type declarations
declare module 'y-websocket/bin/utils' {
  import type { IncomingMessage } from 'node:http'
  import type { WebSocket } from 'ws'
  import type { Doc } from 'yjs'

  export interface WSSharedDoc extends Doc {
    name: string
    // Open connections, with the awareness client ids they control
    conns: Map<WebSocket, Set<number>>
    // Destroyed with the doc
    awareness: { destroy(): void }
  }

  // Rooms in memory, by name
  export const docs: Map<string, WSSharedDoc>

  // Get a room, created if needed
  export function getYDoc(name: string, gc?: boolean): WSSharedDoc

  export function setupWSConnection(
    conn: WebSocket,
    req: IncomingMessage,
    options?: { docName?: string; gc?: boolean }
  ): void
}
