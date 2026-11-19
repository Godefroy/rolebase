import { FastifyInstance } from 'fastify'
import type { IncomingMessage } from 'node:http'
import type { Duplex } from 'node:stream'
import { WebSocketServer, type RawData, type WebSocket } from 'ws'
import { setupWSConnection } from 'y-websocket/bin/utils'
import { captureError } from '../../utils/sentry'
import { getRoomAccess } from './getRoomAccess'
import {
  acquireRoom,
  attachConnection,
  releaseRoom,
  saveAllRooms,
  type RoomState,
} from './roomStore'
import { parseRoom, type ParsedRoom } from './rooms'
import { verifyCollabToken } from './verifyCollabToken'

// Collaborative editing (y-websocket) for the webapp's CollabEditor, served
// on /collab/<room>. Every connection must carry a Nhost access token
// (`token` query param) and target a known room the user can read. Users who
// can't update the entity behind the room get a read-only connection: their
// document updates are dropped. Rooms are loaded from and saved to their
// entity by the server (see roomStore).

const pathPrefix = '/collab/'

// y-websocket message types
const messageSync = 0
const messageSyncStep1 = 0
// Custom message sent by the client with a refreshed access token
// (see packages/editor/src/react/RichEditor.tsx)
const messageRefreshToken = 100

// WebSocket close codes
const closeTokenExpired = 4401
const closeForbidden = 4403
// The client was synced with a previous instance of the room
// (`instance` query param): it must reconnect with a fresh document
const closeRoomReloaded = 4409

// Tolerated clock skew when closing connections at token expiration
const expirationGraceMs = 10_000

const shutdownSaveTimeoutMs = 10_000

interface ConnectionState {
  room: ParsedRoom
  userId: string
  readOnly: boolean
  expirationTimer?: NodeJS.Timeout
}

export function registerCollab(server: FastifyInstance) {
  const wss = new WebSocketServer({ noServer: true })
  server.server.on('upgrade', (request, socket, head) =>
    handleUpgrade(wss, request, socket, head)
  )
  // Save rooms before stopping, within a limited time
  for (const signal of ['SIGTERM', 'SIGINT'] as const) {
    process.once(signal, () => {
      const timeout = new Promise((resolve) =>
        setTimeout(resolve, shutdownSaveTimeoutMs)
      )
      Promise.race([saveAllRooms(), timeout]).finally(() => process.exit(0))
    })
  }
}

async function handleUpgrade(
  wss: WebSocketServer,
  request: IncomingMessage,
  socket: Duplex,
  head: Buffer
) {
  socket.on('error', () => socket.destroy())

  const url = new URL(request.url || '/', 'http://localhost')
  const room = url.pathname.startsWith(pathPrefix)
    ? parseRoom(safeDecode(url.pathname.slice(pathPrefix.length)))
    : undefined
  if (!room) {
    return rejectUpgrade(socket, 404, 'Not Found')
  }

  const token = url.searchParams.get('token')
  let tokenInfo
  try {
    if (!token) throw new Error('Missing token')
    tokenInfo = verifyCollabToken(token)
  } catch {
    return rejectUpgrade(socket, 401, 'Unauthorized')
  }

  let readOnly: boolean
  try {
    const access = await getRoomAccess(room, tokenInfo.userId)
    if (!access.canRead) {
      return rejectUpgrade(socket, 403, 'Forbidden')
    }
    readOnly = !access.canEdit
  } catch (error) {
    console.error('[collab] Access check failed', error)
    captureError(error as Error, { room: room.name })
    return rejectUpgrade(socket, 500, 'Internal Server Error')
  }

  let roomState: RoomState
  try {
    roomState = await acquireRoom(room)
  } catch (error) {
    console.error('[collab] Room loading failed', error)
    captureError(error as Error, { room: room.name })
    return rejectUpgrade(socket, 500, 'Internal Server Error')
  }

  if (socket.destroyed) return releaseRoom(room.name)
  // ws may reject the upgrade without calling back
  let upgraded = false
  socket.once('close', () => {
    if (!upgraded) releaseRoom(room.name)
  })
  wss.handleUpgrade(request, socket, head, (conn) => {
    upgraded = true
    const instance = url.searchParams.get('instance')
    if (instance && instance !== roomState.instance) {
      conn.close(closeRoomReloaded, 'Room reloaded')
      return releaseRoom(room.name)
    }
    const state: ConnectionState = { room, userId: tokenInfo.userId, readOnly }
    scheduleExpiration(conn, state, tokenInfo.expiresAt)
    conn.on('close', () => clearTimeout(state.expirationTimer))
    filterMessages(conn, state)
    setupWSConnection(conn, request, { docName: room.name })
    attachConnection(roomState, conn, tokenInfo.userId)
  })
}

function safeDecode(value: string): string {
  try {
    return decodeURIComponent(value)
  } catch {
    return ''
  }
}

function rejectUpgrade(socket: Duplex, status: number, message: string) {
  socket.end(
    `HTTP/1.1 ${status} ${message}\r\nConnection: close\r\nContent-Length: 0\r\n\r\n`
  )
}

// Close the connection when the token expires, unless the client sends a
// refreshed token before. The client then reconnects with a fresh token.
function scheduleExpiration(
  conn: WebSocket,
  state: ConnectionState,
  expiresAt: number
) {
  clearTimeout(state.expirationTimer)
  state.expirationTimer = setTimeout(
    () => conn.close(closeTokenExpired, 'Token expired'),
    Math.max(0, expiresAt - Date.now() + expirationGraceMs)
  )
}

// Wrap the message listener that y-websocket registers on the connection,
// to handle token refreshes and drop updates of read-only connections.
function filterMessages(conn: WebSocket, state: ConnectionState) {
  const on = conn.on.bind(conn)
  conn.on = ((event: string, listener: (...args: unknown[]) => void) => {
    if (event !== 'message') return on(event, listener)
    return on('message', (data: RawData, isBinary: boolean) => {
      const message = toUint8Array(data)
      if (message.length === 0) return
      const messageType = message[0]
      if (messageType === messageRefreshToken) {
        handleRefreshToken(conn, state, message.subarray(1))
        return
      }
      // Read-only: only allow sync step 1 (state vector request) and
      // awareness (presence). Sync step 2 and updates would modify the doc.
      if (
        state.readOnly &&
        messageType === messageSync &&
        message[1] !== messageSyncStep1
      ) {
        return
      }
      listener(data, isBinary)
    })
  }) as typeof conn.on
}

// Verify the refreshed token and the access again, so that a user who lost
// their access is disconnected within the token lifetime (15 min)
async function handleRefreshToken(
  conn: WebSocket,
  state: ConnectionState,
  tokenBytes: Uint8Array
) {
  let tokenInfo
  try {
    tokenInfo = verifyCollabToken(new TextDecoder().decode(tokenBytes))
    if (tokenInfo.userId !== state.userId) throw new Error('User changed')
  } catch {
    conn.close(closeTokenExpired, 'Invalid token')
    return
  }
  try {
    const access = await getRoomAccess(state.room, state.userId)
    if (!access.canRead) {
      conn.close(closeForbidden, 'Forbidden')
      return
    }
    state.readOnly = !access.canEdit
  } catch (error) {
    // Keep the current access if Hasura is unavailable
    console.error('[collab] Access check failed', error)
  }
  scheduleExpiration(conn, state, tokenInfo.expiresAt)
}

function toUint8Array(data: RawData): Uint8Array {
  if (Array.isArray(data)) return new Uint8Array(Buffer.concat(data))
  return new Uint8Array(data)
}
