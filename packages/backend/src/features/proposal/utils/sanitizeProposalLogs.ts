import {
  EntitiesChanges,
  EntitiesTypes,
  EntityChange,
  EntityChangeType,
  LogDisplay,
  LogType,
} from '@rolebase/shared/model/log'
import { ProposalLog } from '@rolebase/shared/model/proposal'

// Proposal logs are written freely by their author through Hasura, then
// replayed with the admin secret when the proposal is approved. Before that,
// every change is checked against the proposal's org and rebuilt with only the
// columns a proposal can legitimately carry (see useDraftOrgEditActions).

export class ProposalValidationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ProposalValidationError'
  }
}

type EntityType = keyof EntitiesTypes

const entityTypes: EntityType[] = [
  'roles',
  'circles',
  'circlesMembers',
  'circlesLinks',
]

// Role text and option columns a proposal can set
const roleColumns = [
  'name',
  'purpose',
  'domain',
  'accountabilities',
  'checklist',
  'indicators',
  'notes',
  'singleMember',
  'parentLink',
  'colorHue',
] as const

// Columns of a created entity (besides id and orgId, which are forced)
const createColumns: Record<EntityType, readonly string[]> = {
  roles: roleColumns,
  circles: ['roleId', 'parentId'],
  circlesMembers: ['circleId', 'memberId'],
  circlesLinks: ['parentId', 'circleId'],
}

// Columns an update can change
const updateColumns: Record<EntityType, readonly string[]> = {
  roles: [...roleColumns, 'archivedAt'],
  circles: ['parentId', 'archivedAt'],
  circlesMembers: ['archivedAt'],
  circlesLinks: ['archivedAt'],
}

const textColumns = new Set([
  'name',
  'purpose',
  'domain',
  'accountabilities',
  'checklist',
  'indicators',
  'notes',
])
const booleanColumns = new Set(['singleMember', 'parentLink'])

const uuidRegex =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export function isUuid(value: unknown): value is string {
  return typeof value === 'string' && uuidRegex.test(value)
}

function isObject(value: unknown): value is Record<string, any> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

// Ids referenced by the proposal, per table
export interface ProposalRefs {
  roles: Set<string>
  circles: Set<string>
  circlesMembers: Set<string>
  circlesLinks: Set<string>
  members: Set<string>
}

// Current state of the referenced entities, loaded with admin rights
export interface ProposalExistingEntities {
  roles: Map<string, { orgId: string; base: boolean; hasCircle: boolean }>
  circles: Map<string, { orgId: string; parentId: string | null }>
  circlesMembers: Map<string, { orgId: string }>
  circlesLinks: Map<string, { orgId: string }>
  members: Map<string, { orgId: string; archivedAt: string | null }>
}

function fail(message: string): never {
  throw new ProposalValidationError(message)
}

function checkStructure(logs: unknown): ProposalLog[] {
  if (!Array.isArray(logs)) fail('Invalid proposal logs')
  for (const log of logs) {
    if (!isObject(log) || !isObject(log.display) || !isObject(log.changes)) {
      fail('Invalid proposal log')
    }
    for (const key of Object.keys(log.changes)) {
      if (!entityTypes.includes(key as EntityType)) {
        fail(`Invalid entity type: ${key}`)
      }
      const changes = log.changes[key]
      if (changes === undefined || changes === null) continue
      if (!Array.isArray(changes)) fail(`Invalid changes: ${key}`)
      for (const change of changes) {
        if (
          !isObject(change) ||
          !Object.values(EntityChangeType).includes(change.type) ||
          !isUuid(change.id)
        ) {
          fail(`Invalid change in ${key}`)
        }
        if (change.type === EntityChangeType.Update) {
          if (!isObject(change.newData) || !isObject(change.prevData)) {
            fail(`Invalid update in ${key}`)
          }
        } else if (!isObject(change.data)) {
          fail(`Invalid change data in ${key}`)
        }
      }
    }
  }
  return logs as ProposalLog[]
}

function forEachChange(
  logs: ProposalLog[],
  callback: (type: EntityType, change: EntityChange<any>) => void
) {
  for (const log of logs) {
    for (const type of entityTypes) {
      for (const change of (log.changes[type] || []) as EntityChange<any>[]) {
        callback(type, change)
      }
    }
  }
}

// Every id the proposal references (targets, created ids and foreign keys), so
// they can be loaded in one request. Also validates the logs structure.
export function collectProposalRefs(rawLogs: unknown): ProposalRefs {
  const logs = checkStructure(rawLogs)
  const refs: ProposalRefs = {
    roles: new Set(),
    circles: new Set(),
    circlesMembers: new Set(),
    circlesLinks: new Set(),
    members: new Set(),
  }
  const addRef = (table: keyof ProposalRefs, id: unknown) => {
    if (id === null || id === undefined) return
    if (!isUuid(id)) fail(`Invalid id: ${String(id)}`)
    refs[table].add(id)
  }

  for (const log of logs) {
    const display = log.display as LogDisplay
    if (display.type === LogType.CircleArchive) {
      addRef('circles', display.id)
    }
  }

  forEachChange(logs, (type, change) => {
    addRef(type, change.id)
    const values =
      change.type === EntityChangeType.Update
        ? [change.newData, change.prevData]
        : [change.data]
    for (const data of values) {
      if (type === 'circles') {
        addRef('roles', data.roleId)
        addRef('circles', data.parentId)
      } else if (type === 'circlesMembers') {
        addRef('circles', data.circleId)
        addRef('members', data.memberId)
      } else if (type === 'circlesLinks') {
        addRef('circles', data.parentId)
        addRef('circles', data.circleId)
      }
    }
  })
  return refs
}

function checkValue(type: EntityType, key: string, value: unknown) {
  const valid =
    key === 'archivedAt'
      ? value === null ||
        (typeof value === 'string' && !isNaN(Date.parse(value)))
      : key === 'colorHue'
        ? value === null || typeof value === 'number'
        : textColumns.has(key)
          ? typeof value === 'string'
          : booleanColumns.has(key)
            ? typeof value === 'boolean'
            : key === 'parentId' && type === 'circles'
              ? value === null || isUuid(value)
              : isUuid(value)
  if (!valid) fail(`Invalid value for ${type}.${key}`)
}

function pick(
  type: EntityType,
  data: Record<string, any>,
  columns: readonly string[]
): Record<string, any> {
  const result: Record<string, any> = {}
  for (const key of columns) {
    if (!(key in data) || data[key] === undefined) continue
    checkValue(type, key, data[key])
    result[key] = data[key]
  }
  return result
}

// Check every change of the proposal against the proposal's org and rebuild it
// with the allowed columns only. Throws a ProposalValidationError when a change
// targets or references an entity outside the org, or is not one a proposal
// can make.
export function sanitizeProposalLogs(
  rawLogs: unknown,
  orgId: string,
  existing: ProposalExistingEntities
): ProposalLog[] {
  const logs = checkStructure(rawLogs)

  // Ids created by the proposal, usable as references by later changes
  const created: Record<EntityType, Set<string>> = {
    roles: new Set(),
    circles: new Set(),
    circlesMembers: new Set(),
    circlesLinks: new Set(),
  }
  forEachChange(logs, (type, change) => {
    if (change.type !== EntityChangeType.Create) return
    if (existing[type].has(change.id) || created[type].has(change.id)) {
      fail(`Entity already exists: ${change.id}`)
    }
    created[type].add(change.id)
  })

  const checkInOrg = (
    table: keyof ProposalExistingEntities,
    id: string,
    canBeCreated = true
  ) => {
    if (canBeCreated && table !== 'members' && created[table].has(id)) return
    const entity = existing[table].get(id)
    if (!entity || entity.orgId !== orgId) {
      fail(`Entity not found in org: ${id}`)
    }
    if (table === 'members' && existing.members.get(id)?.archivedAt) {
      fail(`Member is archived: ${id}`)
    }
  }

  // Foreign keys of a change, which must all belong to the org
  const checkReferences = (type: EntityType, data: Record<string, any>) => {
    if (type === 'circles') {
      if (data.parentId) checkInOrg('circles', data.parentId)
      if (data.roleId) checkInOrg('roles', data.roleId)
    } else if (type === 'circlesMembers') {
      if (data.circleId) checkInOrg('circles', data.circleId)
      if (data.memberId) checkInOrg('members', data.memberId)
    } else if (type === 'circlesLinks') {
      if (data.parentId) checkInOrg('circles', data.parentId)
      if (data.circleId) checkInOrg('circles', data.circleId)
    }
  }

  const sanitizeChanges = (
    type: EntityType,
    changes: EntityChange<any>[]
  ): EntityChange<any>[] =>
    changes.map((change): EntityChange<any> => {
      // id and orgId cannot be changed, nor set to another value
      const values =
        change.type === EntityChangeType.Update
          ? [change.newData, change.prevData]
          : [change.data]
      for (const data of values) {
        if ('id' in data && data.id !== change.id) fail('Invalid id')
        if ('orgId' in data && data.orgId !== orgId) fail('Invalid orgId')
      }

      if (change.type === EntityChangeType.Create) {
        const data: Record<string, any> = {
          ...pick(type, change.data, createColumns[type]),
          id: change.id,
          orgId,
          archivedAt: null,
        }
        if (type === 'roles') {
          // Base roles are managed by org owners, never through a proposal
          data.base = false
          if (typeof data.name !== 'string' || !data.name) {
            fail('Invalid role name')
          }
        } else {
          for (const key of createColumns[type]) {
            if (type === 'circles' && key === 'parentId') continue
            if (!data[key]) fail(`Missing ${type}.${key}`)
          }
        }
        if (type === 'circles') {
          // Same invariant as the Hasura circle permissions: a circle uses a
          // base role or a role of its own
          if (!created.roles.has(data.roleId)) {
            const role = existing.roles.get(data.roleId)
            if (role && !role.base && role.hasCircle) {
              fail(`Role already used by a circle: ${data.roleId}`)
            }
          }
        }
        checkReferences(type, data)
        return { type: change.type, id: change.id, data }
      }

      // Update and Delete target an existing entity of the org (or one
      // created earlier in the proposal)
      checkInOrg(type, change.id)

      if (change.type === EntityChangeType.Delete) {
        if (type === 'circles' && isRootCircle(change.id)) {
          fail('The root circle cannot be archived')
        }
        return {
          type: change.type,
          id: change.id,
          data: {
            ...pick(type, change.data, createColumns[type]),
            id: change.id,
            orgId,
          },
        }
      }

      const newData = pick(type, change.newData, updateColumns[type])
      const prevData = pick(type, change.prevData, updateColumns[type])
      if (type === 'circles') {
        if (newData.parentId && newData.parentId === change.id) {
          fail('Invalid parent')
        }
        if (isRootCircle(change.id) && newData.archivedAt) {
          fail('The root circle cannot be archived')
        }
      }
      checkReferences(type, newData)
      checkReferences(type, prevData)
      return { type: change.type, id: change.id, prevData, newData }
    })

  const isRootCircle = (id: string) => {
    if (created.circles.has(id)) return false
    return existing.circles.get(id)?.parentId === null
  }

  return logs.map((log): ProposalLog => {
    const display = log.display as LogDisplay
    if (display.type === LogType.CircleArchive) {
      checkInOrg('circles', display.id, false)
      if (isRootCircle(display.id)) {
        fail('The root circle cannot be archived')
      }
    }

    const changes: EntitiesChanges = {}
    for (const type of entityTypes) {
      const entityChanges = log.changes[type] as EntityChange<any>[] | undefined
      if (!entityChanges) continue
      changes[type] = sanitizeChanges(type, entityChanges) as any
    }
    return { ...log, changes }
  })
}
