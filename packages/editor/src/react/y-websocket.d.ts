// y-websocket@1 ships types that are not resolvable with the
// "Bundler" module resolution (broken package.json exports).
// Minimal declaration of what we use.
declare module 'y-websocket' {
  import { Doc } from 'yjs'

  export class WebsocketProvider {
    constructor(
      serverUrl: string,
      roomname: string,
      doc: Doc,
      opts?: { connect?: boolean; params?: Record<string, string> }
    )
    awareness: unknown
    synced: boolean
    connect(): void
    disconnect(): void
    destroy(): void
    on(event: string, handler: (...args: any[]) => void): void
    off(event: string, handler: (...args: any[]) => void): void
  }
}
