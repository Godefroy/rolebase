import { useOrgContext } from '@/org/contexts/OrgContext'
import { OrgDataFragment, RoleFragment } from '@gql'
import { applyEntitiesChanges } from '@rolebase/shared/helpers/log/applyEntitiesChanges'
import { ActingLeader, OrgData } from '@rolebase/shared/model/OrgData'
import { generateId } from '@rolebase/shared/helpers/generateId'
import {
  EntitiesApplyMethods,
  EntitiesChanges,
  EntityChangeType,
  LogDisplay,
} from '@rolebase/shared/model/log'
import { ProposalLog } from '@rolebase/shared/model/proposal'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

export interface ProposalDraft {
  ready: boolean
  // Indexed view of the current draft data (recomputed on every change)
  orgData: OrgData | undefined
  roleOverlays: Record<string, Partial<RoleFragment>>
  logs: ProposalLog[]
  hasError: boolean
  // Apply a change to the draft and append a log
  applyLog(display: LogDisplay, changes: EntitiesChanges): Promise<void>
  // Remove a log and replay the remaining ones from scratch
  removeLog(logId: string): Promise<void>
  // Replace a log's changes in place (keeping its position) and replay
  replaceLog(logId: string, changes: EntitiesChanges): Promise<void>
  // Live logs, up to date even between awaited apply/remove/replace calls
  // (the `logs` field is the render snapshot and can lag by one edit)
  getLogs(): ProposalLog[]
  // Read-only access to the current mutable draft data (for building changes)
  getData(): OrgDataFragment | undefined
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

function buildMethods(data: OrgDataFragment): EntitiesApplyMethods {
  return {
    roles: arrayMethods(data.roles),
    circles: arrayMethods(data.circles),
    circlesMembers: arrayMethods(data.circleMembers),
    circlesLinks: arrayMethods(data.circleLinks),
  } as EntitiesApplyMethods
}

// In-memory proposal draft: clones the org subscription result, replays the
// proposal's logs onto it, and exposes an indexed OrgData snapshot + apply/
// remove operations. The draft mutates the flat arrays in place; role text is
// fetched per circle by the panel and overlaid (roleOverlays).
export default function useProposalDraft(
  initialLogs: ProposalLog[],
  actingLeader?: ActingLeader
): ProposalDraft {
  const { getOrgResult, ready: orgReady } = useOrgContext()

  // Initial data (kept to rebuild from scratch on removeLog)
  const initialRef = useRef<OrgDataFragment | null>(null)
  // Working data + apply methods
  const workingRef = useRef<{
    data: OrgDataFragment
    methods: EntitiesApplyMethods
  }>()

  const [ready, setReady] = useState(false)
  const [logs, setLogs] = useState<ProposalLog[]>([])
  // Mirrors `logs` synchronously so apply/remove can read the latest list
  // without waiting for a re-render.
  const logsRef = useRef<ProposalLog[]>([])
  const [version, setVersion] = useState(0)

  // Replay a list of logs onto fresh working data, flagging failures
  const rebuild = useCallback(async (logsToApply: ProposalLog[]) => {
    if (!initialRef.current) return
    const data = clone(initialRef.current)
    const methods = buildMethods(data)
    workingRef.current = { data, methods }

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
    logsRef.current = nextLogs
    setLogs(nextLogs)
    setVersion((v) => v + 1)
  }, [])

  // Seed the draft from the org subscription result.
  useEffect(() => {
    const result = getOrgResult()
    if (!result) return
    let canceled = false

    initialRef.current = clone(result)

    rebuild(initialLogs).then(() => {
      if (!canceled) setReady(true)
    })
    return () => {
      canceled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orgReady])

  const applyLog = useCallback(
    async (display: LogDisplay, changes: EntitiesChanges) => {
      if (!workingRef.current) return
      await rebuild([...logsRef.current, { id: generateId(), display, changes }])
    },
    [rebuild]
  )

  const removeLog = useCallback(
    async (logId: string) => {
      await rebuild(logsRef.current.filter((l) => l.id !== logId))
    },
    [rebuild]
  )

  const replaceLog = useCallback(
    async (logId: string, changes: EntitiesChanges) => {
      if (!workingRef.current) return
      await rebuild(
        logsRef.current.map((l) => (l.id === logId ? { ...l, changes } : l))
      )
    },
    [rebuild]
  )

  const getLogs = useCallback(() => logsRef.current, [])

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

  const orgData = useMemo<OrgData | undefined>(() => {
    const data = workingRef.current?.data
    return data
      ? new OrgData(
          data.circles,
          data.circleMembers,
          data.circleLinks,
          data.roles,
          data.members,
          actingLeader
        )
      : undefined
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [version, actingLeader])

  const hasError = useMemo(() => logs.some((l) => l.error), [logs])

  const getData = useCallback(() => workingRef.current?.data, [])

  return {
    ready,
    orgData,
    roleOverlays,
    logs,
    hasError,
    applyLog,
    removeLog,
    replaceLog,
    getLogs,
    getData,
  }
}
