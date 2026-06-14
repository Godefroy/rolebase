import { describe, expect, it } from 'vitest'
import { CircleFragment } from '../../gql'
import {
  EntitiesApplyMethods,
  EntitiesChanges,
  EntitiesMethods,
  EntityChangeType,
} from '../../model/log'
import { circles as mockCircles } from '../../mocks/circles'
import { applyEntitiesChanges } from './applyEntitiesChanges'
import { cancelLogChanges } from './cancelLogChanges'
import { replayLogs } from './replayLogs'

// Build apply methods (get/create/update) over an in-memory array
function arrayApplyMethods<Entity extends { id: string }>(
  arr: Entity[]
): EntitiesApplyMethods[keyof EntitiesApplyMethods] {
  return {
    get: async (id: string) => arr.find((e) => e.id === id) as any,
    create: async (data: Entity) => {
      arr.push(data)
    },
    update: async (id: string, data: Partial<Entity>) => {
      const entity = arr.find((e) => e.id === id)
      if (entity) Object.assign(entity, data)
    },
  } as any
}

function arrayMethods<Entity extends { id: string }>(
  arr: Entity[]
): EntitiesMethods[keyof EntitiesMethods] {
  const m = arrayApplyMethods(arr)
  return { get: m.get, update: m.update } as any
}

describe('applyEntitiesChanges', () => {
  it('applies a Create', async () => {
    const circles = mockCircles.map((c) => ({ ...c }))
    const newCircle: CircleFragment = {
      id: 'circle-new',
      orgId: 'org-1',
      roleId: 'role-dev',
      parentId: 'circle-super',
      archived: false,
    }
    const changes: EntitiesChanges = {
      circles: [{ type: EntityChangeType.Create, id: 'circle-new', data: newCircle }],
    }
    await applyEntitiesChanges(changes, {
      circles: arrayApplyMethods(circles),
    } as EntitiesApplyMethods)

    expect(circles.find((c) => c.id === 'circle-new')).toEqual(newCircle)
  })

  it('applies an Update (move circle)', async () => {
    const circles = mockCircles.map((c) => ({ ...c }))
    const changes: EntitiesChanges = {
      circles: [
        {
          type: EntityChangeType.Update,
          id: 'circle-agence-dev',
          prevData: { parentId: 'circle-agence' },
          newData: { parentId: 'circle-studio' },
        },
      ],
    }
    await applyEntitiesChanges(changes, {
      circles: arrayApplyMethods(circles),
    } as EntitiesApplyMethods)

    expect(circles.find((c) => c.id === 'circle-agence-dev')?.parentId).toBe(
      'circle-studio'
    )
  })

  it('round-trips apply then cancel back to the initial state', async () => {
    const circles = mockCircles.map((c) => ({ ...c }))
    const changes: EntitiesChanges = {
      circles: [
        {
          type: EntityChangeType.Update,
          id: 'circle-agence-dev',
          prevData: { parentId: 'circle-agence' },
          newData: { parentId: 'circle-studio' },
        },
      ],
    }
    await applyEntitiesChanges(changes, {
      circles: arrayApplyMethods(circles),
    } as EntitiesApplyMethods)

    await cancelLogChanges({ changes } as any, {
      circles: arrayMethods(circles),
    } as EntitiesMethods)

    expect(circles.find((c) => c.id === 'circle-agence-dev')?.parentId).toBe(
      'circle-agence'
    )
  })

  it('replayLogs flags a log referencing a missing entity', async () => {
    const circles = mockCircles.map((c) => ({ ...c }))
    const methods = { circles: arrayApplyMethods(circles) } as EntitiesApplyMethods
    const { failedLogIds } = await replayLogs(
      [
        {
          id: 'log-ok',
          changes: {
            circles: [
              {
                type: EntityChangeType.Update,
                id: 'circle-agence-dev',
                prevData: { parentId: 'circle-agence' },
                newData: { parentId: 'circle-studio' },
              },
            ],
          },
        },
        {
          id: 'log-bad',
          changes: {
            circles: [
              {
                type: EntityChangeType.Update,
                id: 'circle-gone',
                prevData: { parentId: null },
                newData: { parentId: 'circle-super' },
              },
            ],
          },
        },
      ],
      methods
    )

    expect(failedLogIds).toEqual(['log-bad'])
  })
})
