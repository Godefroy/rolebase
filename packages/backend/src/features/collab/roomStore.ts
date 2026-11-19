import { getYDocMarkdown, setYDocMarkdown } from '@rolebase/editor'
import { randomUUID } from 'node:crypto'
import type { WebSocket } from 'ws'
import { docs, getYDoc, type WSSharedDoc } from 'y-websocket/bin/utils'
import { captureError } from '../../utils/sentry'
import { loadRoomContent, saveRoomContent } from './roomContent'
import { ParsedRoom } from './rooms'

// Rooms are loaded from their entity on the first connection, saved to it
// while they are edited, then saved and freed after their last connection.

// Save after this delay without change, and at least this often while edited
const saveDelay = 2_000
const maxSaveDelay = 10_000

const loadOrigin = Symbol('collab-load')

export interface RoomState {
  room: ParsedRoom
  doc: WSSharedDoc
  // Changes at each load: clients synced with a previous instance must
  // start from a fresh document, merging theirs would duplicate the content
  instance: string
  savedMarkdown: string
  // User of the last change, whose permissions are used to save
  lastEditorId?: string
  // Time of the first unsaved change
  dirtySince?: number
  saveTimer?: NodeJS.Timeout
  // Saves are chained to keep their order
  saving: Promise<void>
}

const rooms = new Map<string, RoomState>()
const loadingRooms = new Map<string, Promise<RoomState>>()
// Connections being opened, which keep their room from being freed
const pendingConnections = new Map<string, number>()
// Last saves of freed rooms, awaited before loading them again
const finalSaves = new Map<string, Promise<void>>()
const connectionUsers = new WeakMap<object, string>()

// Load the room if needed and keep it until attachConnection or releaseRoom
export async function acquireRoom(room: ParsedRoom): Promise<RoomState> {
  addPendingConnection(room.name, 1)
  try {
    return rooms.get(room.name) ?? (await loadRoom(room))
  } catch (error) {
    releaseRoom(room.name)
    throw error
  }
}

// Release a room acquired for a connection that won't be attached
export function releaseRoom(name: string) {
  addPendingConnection(name, -1)
  freeRoomIfUnused(name)
}

// Call after y-websocket's setupWSConnection, to attribute the connection's
// changes to its user and free the room after its last connection
export function attachConnection(
  state: RoomState,
  conn: WebSocket,
  userId: string
) {
  connectionUsers.set(conn, userId)
  addPendingConnection(state.room.name, -1)
  // Registered after y-websocket's own close listener, which removes the
  // connection from the doc
  conn.on('close', () => freeRoomIfUnused(state.room.name))
}

// Save every room, before the server stops
export async function saveAllRooms() {
  await Promise.all([
    ...Array.from(rooms.values(), saveRoom),
    ...finalSaves.values(),
  ])
}

function addPendingConnection(name: string, delta: number) {
  const count = (pendingConnections.get(name) ?? 0) + delta
  if (count > 0) pendingConnections.set(name, count)
  else pendingConnections.delete(name)
}

function loadRoom(room: ParsedRoom): Promise<RoomState> {
  let promise = loadingRooms.get(room.name)
  if (!promise) {
    promise = createRoom(room).finally(() => loadingRooms.delete(room.name))
    loadingRooms.set(room.name, promise)
  }
  return promise
}

async function createRoom(room: ParsedRoom): Promise<RoomState> {
  await finalSaves.get(room.name)
  const markdown = await loadRoomContent(room)

  const doc = getYDoc(room.name)
  const state: RoomState = {
    room,
    doc,
    instance: randomUUID(),
    savedMarkdown: '',
    saving: Promise.resolve(),
  }
  try {
    doc.transact(() => {
      setYDocMarkdown(doc, markdown)
      const meta = doc.getMap('meta')
      // Prevents clients from seeding the room themselves
      meta.set('seeded', true)
      meta.set('instance', state.instance)
    }, loadOrigin)
    state.savedMarkdown = getYDocMarkdown(doc)
  } catch (error) {
    docs.delete(room.name)
    doc.destroy()
    throw error
  }

  doc.on('update', (_update: Uint8Array, origin: unknown) => {
    // Changes from clients have their connection as origin
    const userId =
      typeof origin === 'object' && origin
        ? connectionUsers.get(origin)
        : undefined
    if (!userId) return
    state.lastEditorId = userId
    scheduleSave(state)
  })
  rooms.set(room.name, state)
  return state
}

function scheduleSave(state: RoomState) {
  state.dirtySince ??= Date.now()
  clearTimeout(state.saveTimer)
  const delay = Math.min(
    saveDelay,
    state.dirtySince + maxSaveDelay - Date.now()
  )
  state.saveTimer = setTimeout(() => saveRoom(state), Math.max(0, delay))
}

// Save the current content (read synchronously, so the doc can be
// destroyed right after)
function saveRoom(state: RoomState): Promise<void> {
  clearTimeout(state.saveTimer)
  state.saveTimer = undefined
  const userId = state.lastEditorId
  if (state.dirtySince === undefined || !userId) return state.saving
  state.dirtySince = undefined

  const markdown = getYDocMarkdown(state.doc)
  state.saving = state.saving.then(async () => {
    if (markdown === state.savedMarkdown) return
    try {
      await saveRoomContent(state.room, markdown, userId)
      state.savedMarkdown = markdown
    } catch (error) {
      console.error('[collab] Save failed', error)
      captureError(error as Error, { room: state.room.name })
      // Retry later if the room is still open
      if (rooms.get(state.room.name) === state) {
        state.dirtySince ??= Date.now()
        clearTimeout(state.saveTimer)
        state.saveTimer = setTimeout(() => saveRoom(state), maxSaveDelay)
      }
    }
  })
  return state.saving
}

// y-websocket keeps docs in memory forever: save and destroy the doc (and
// its awareness, destroyed with it) once its last connection is closed
function freeRoomIfUnused(name: string) {
  const doc = docs.get(name)
  if (!doc || doc.conns.size > 0 || pendingConnections.has(name)) return

  const state = rooms.get(name)
  rooms.delete(name)
  docs.delete(name)
  if (state) {
    const save = saveRoom(state).finally(() => {
      if (finalSaves.get(name) === save) finalSaves.delete(name)
    })
    finalSaves.set(name, save)
  }
  doc.destroy()
}
