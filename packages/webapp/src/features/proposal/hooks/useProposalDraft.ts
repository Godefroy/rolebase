import { OrgData } from '@/org/contexts/OrgDataContext'
import { useOrgId } from '@/org/hooks/useOrgId'
import { RoleFragment } from '@gql'
import { applyEntitiesChanges } from '@rolebase/shared/helpers/log/applyEntitiesChanges'
import { generateId } from '@rolebase/shared/helpers/generateId'
import {
  EntitiesApplyMethods,
  EntitiesChanges,
  EntityChangeType,
  LogDisplay,
} from '@rolebase/shared/model/log'
import { ProposalLog } from '@rolebase/shared/model/proposal'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { FlatData, buildFlatFromStore } from '../utils/buildFlatFromStore'
import { reconstructCircles } from '../utils/reconstructCircles'

export type { FlatData }

export interface ProposalDraft {
  ready: boolean
  orgData: OrgData
  logs: ProposalLog[]
  hasError: boolean
  // Apply a change to the draft and append a log
  applyLog(display: LogDisplay, changes: EntitiesChanges): Promise<void>
  // Remove a log and replay the remaining ones from scratch
  removeLog(logId: string): Promise<void>
  // Read-only access to the current flat draft data (for building changes)
  getFlat(): FlatData | undefined
}

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value))
}

// Build get/create/update methods over a mutable array
function arrayMethods<Entity extends { id: string }>(arr: Entity[]) {
  return {
    get: async (id: string) => arr.find((e) => e.id === id),
    create: async (data: Entity) => {
      arr.push(data)
    },
    update: async (id: string, data: Partial<Entity>) => {
      const entity = arr.find((e) => e.id === id)
      if (entity) Object.assign(entity, data)
    },
  }
}

function buildMethods(flat: FlatData): EntitiesApplyMethods {
  return {
    roles: arrayMethods(flat.roles),
    circles: arrayMethods(flat.circles),
    circlesMembers: arrayMethods(flat.circleMembers),
    circlesLinks: arrayMethods(flat.circleLinks),
  } as EntitiesApplyMethods
}

// In-memory proposal draft: loads the org data, replays the proposal's logs,
// and exposes an OrgData snapshot + apply/remove operations.
export default function useProposalDraft(
  initialLogs: ProposalLog[]
): ProposalDraft {
  const orgId = useOrgId()

  // Initial flat data (kept to rebuild from scratch on removeLog)
  const initialRef = useRef<FlatData | null>(null)
  // Working flat data + apply methods
  const workingRef = useRef<{ flat: FlatData; methods: EntitiesApplyMethods }>()

  const [ready, setReady] = useState(false)
  const [logs, setLogs] = useState<ProposalLog[]>([])
  const [version, setVersion] = useState(0)

  // Replay a list of logs onto fresh working data, flagging failures
  const rebuild = useCallback(async (logsToApply: ProposalLog[]) => {
    if (!initialRef.current) return
    const flat = clone(initialRef.current)
    const methods = buildMethods(flat)
    workingRef.current = { flat, methods }

    const nextLogs: ProposalLog[] = []
    for (const log of logsToApply) {
      const next: ProposalLog = { ...log, error: undefined }
      try {
        await applyEntitiesChanges(log.changes, methods)
      } catch (e) {
        next.error = e instanceof Error ? e.message : 'error'
      }
      nextLogs.push(next)
    }
    setLogs(nextLogs)
    setVersion((v) => v + 1)
  }, [])

  // Build the draft snapshot entirely from the org data already in the store.
  // Roles are reconstructed as RoleSummary (the store holds no full role
  // fields); the panel fetches full role text per circle via subscription and
  // overlays the draft's pending edits (see roleOverlays below).
  useEffect(() => {
    if (!orgId) return
    let canceled = false

    initialRef.current = clone(buildFlatFromStore(orgId))

    rebuild(initialLogs).then(() => {
      if (!canceled) setReady(true)
    })
    return () => {
      canceled = true
    }
  }, [orgId])

  const applyLog = useCallback(
    async (display: LogDisplay, changes: EntitiesChanges) => {
      const working = workingRef.current
      if (!working) return
      const log: ProposalLog = { id: generateId(), display, changes }
      try {
        await applyEntitiesChanges(changes, working.methods)
      } catch (e) {
        log.error = e instanceof Error ? e.message : 'error'
      }
      setLogs((prev) => [...prev, log])
      setVersion((v) => v + 1)
    },
    []
  )

  const removeLog = useCallback(
    async (logId: string) => {
      await rebuild(logs.filter((l) => l.id !== logId))
    },
    [logs, rebuild]
  )

  // Pending role-field edits, keyed by roleId (created roles + updates)
  const roleOverlays = useMemo(() => {
    const overlays: Record<string, Partial<RoleFragment>> = {}
    for (const log of logs) {
      for (const change of log.changes.roles || []) {
        if (change.type === EntityChangeType.Create) {
          overlays[change.id] = { ...overlays[change.id], ...change.data }
        } else if (change.type === EntityChangeType.Update) {
          overlays[change.id] = { ...overlays[change.id], ...change.newData }
        }
      }
    }
    return overlays
  }, [logs])

  const orgData = useMemo<OrgData>(() => {
    const flat = workingRef.current?.flat
    if (!flat) {
      return { circles: undefined, members: undefined, baseRoles: undefined }
    }
    return {
      circles: reconstructCircles(
        flat.circles,
        flat.roles,
        flat.members,
        flat.circleMembers,
        flat.circleLinks
      ),
      members: flat.members,
      baseRoles: flat.roles.filter((r) => r.base),
      roleOverlays,
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [version, roleOverlays])

  const hasError = useMemo(() => logs.some((l) => l.error), [logs])

  const getFlat = useCallback(() => workingRef.current?.flat, [])

  return { ready, orgData, logs, hasError, applyLog, removeLog, getFlat }
}
