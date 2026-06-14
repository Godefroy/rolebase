import {
  EntitiesApplyMethods,
  EntitiesChanges,
  EntitiesTypes,
  EntityChange,
} from '../../model/log'
import { applyEntityChanges } from './applyEntityChanges'

// Apply order: a referenced entity must exist before the entity referencing it.
// (roles before circles; circles before circlesMembers / circlesLinks)
const applyOrder: (keyof EntitiesTypes)[] = [
  'roles',
  'circles',
  'circlesMembers',
  'circlesLinks',
]

// Apply a whole EntitiesChanges forward (counterpart of cancelLogChanges).
export async function applyEntitiesChanges(
  changes: EntitiesChanges,
  methods: EntitiesApplyMethods
): Promise<void> {
  for (const type of applyOrder) {
    const entityChanges = changes[type]
    if (!entityChanges) continue
    await applyEntityChanges(
      entityChanges as EntityChange<{ id: string; archived: boolean }>[],
      methods[type] as any
    )
  }
}
