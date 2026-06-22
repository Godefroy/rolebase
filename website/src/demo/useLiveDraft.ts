import type { MemberFragment, RoleFragment } from '@rolebase/shared/gql'
import { generateId } from '@rolebase/shared/helpers/generateId'
import { applyEntitiesChanges } from '@rolebase/shared/helpers/log/applyEntitiesChanges'
import {
  type EntitiesApplyMethods,
  type EntitiesChanges,
} from '@rolebase/shared/model/log'
import { OrgData } from '@rolebase/shared/model/OrgData'
import { useCallback, useMemo, useRef, useState } from 'react'
import type { DemoFragments } from './orgDemoData'

// A "live" in-memory org draft for the demo. It exposes the same surface as the
// webapp's proposal draft (so the webapp's edit-action hook works on it), but
// applies every change directly to the flat data with no proposal log. Member
// fields are also editable here (readonly in a real proposal draft).
//
// Because `logs` is always empty, the webapp's draft actions take their "live"
// branches (archive instead of cancelling a creation, etc.).

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value))
}

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

function buildMethods(data: DemoFragments): EntitiesApplyMethods {
  return {
    roles: arrayMethods(data.roles),
    circles: arrayMethods(data.circles),
    circlesMembers: arrayMethods(data.circleMembers),
    circlesLinks: arrayMethods(data.circleLinks),
  } as EntitiesApplyMethods
}

export interface LiveDraft {
  ready: boolean
  orgData: OrgData
  roleOverlays: Record<string, Partial<RoleFragment>>
  logs: never[]
  hasError: boolean
  applyLog(display: unknown, changes: EntitiesChanges): Promise<void>
  removeLog(): Promise<void>
  replaceLog(): Promise<void>
  getLogs(): never[]
  getData(): DemoFragments
  // Live indexed view, always current even between awaited calls in one tick.
  getOrgData(): OrgData
  // Member fields are editable in the demo (unlike a real proposal draft).
  updateMember(member: MemberFragment, values: Partial<MemberFragment>): Promise<void>
  // Create a new member in memory and return its id.
  createMember(name: string): Promise<string>
  // Archive a member in memory (and their circle memberships).
  archiveMember(memberId: string): Promise<void>
}

export default function useLiveDraft(initial: DemoFragments): LiveDraft {
  const workingRef = useRef<{
    data: DemoFragments
    methods: EntitiesApplyMethods
  }>()
  if (!workingRef.current) {
    const data = clone(initial)
    workingRef.current = { data, methods: buildMethods(data) }
  }

  // Live indexed view, rebuilt synchronously on every change and kept in a
  // stable ref so edit actions always read the latest data within one tick.
  const orgDataRef = useRef<OrgData>()
  if (!orgDataRef.current)
    orgDataRef.current = new OrgData(workingRef.current.data)

  const [version, setVersion] = useState(0)

  // Rebuild the live indexed view, then trigger a re-render.
  const refresh = useCallback(() => {
    orgDataRef.current = new OrgData(workingRef.current!.data)
    setVersion((v) => v + 1)
  }, [])

  const orgData = useMemo<OrgData>(
    () => orgDataRef.current!,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [version]
  )

  const applyLog = useCallback(async (_display: unknown, changes: EntitiesChanges) => {
    if (!workingRef.current) return
    await applyEntitiesChanges(changes, workingRef.current.methods)
    refresh()
  }, [refresh])

  const updateMember = useCallback(
    async (member: MemberFragment, values: Partial<MemberFragment>) => {
      const data = workingRef.current?.data
      const target = data?.members.find((m) => m.id === member.id)
      if (!target) return
      Object.assign(target, values)
      refresh()
    },
    [refresh]
  )

  const createMember = useCallback(async (name: string) => {
    const data = workingRef.current!.data
    const id = generateId()
    data.members.push({
      id,
      orgId: data.members[0]?.orgId ?? 'demo-org',
      name,
      description: '',
      picture: null,
      pictureFileId: null,
      userId: null,
      inviteEmail: null,
      inviteDate: null,
      role: null,
      archivedAt: null,
    } as MemberFragment)
    refresh()
    return id
  }, [refresh])

  const archiveMember = useCallback(async (memberId: string) => {
    const data = workingRef.current?.data
    if (!data) return
    const member = data.members.find((m) => m.id === memberId)
    if (member) member.archivedAt = new Date().toISOString()
    for (const cm of data.circleMembers) {
      if (cm.memberId === memberId) cm.archivedAt = new Date().toISOString()
    }
    refresh()
  }, [refresh])

  const noop = useCallback(async () => {}, [])
  const getData = useCallback(() => workingRef.current!.data, [])
  const getOrgData = useCallback(() => orgDataRef.current!, [])
  const getLogs = useCallback((): never[] => [], [])

  return useMemo<LiveDraft>(
    () => ({
      ready: true,
      orgData,
      roleOverlays: {},
      logs: [],
      hasError: false,
      applyLog,
      removeLog: noop,
      replaceLog: noop,
      getLogs,
      getData,
      getOrgData,
      updateMember,
      createMember,
      archiveMember,
    }),
    [
      orgData,
      applyLog,
      noop,
      getLogs,
      getData,
      getOrgData,
      updateMember,
      createMember,
      archiveMember,
    ]
  )
}
