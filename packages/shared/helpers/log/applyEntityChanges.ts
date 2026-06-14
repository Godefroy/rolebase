import {
  EntityApplyMethods,
  EntityChange,
  EntityChangeType,
} from '../../model/log'

// Thrown when a change references an entity that no longer exists.
// Used to flag a log as failed during replay.
export class EntityChangeError extends Error {
  constructor(public entityId: string) {
    super(`Entity not found: ${entityId}`)
    this.name = 'EntityChangeError'
  }
}

// Apply changes forward onto a source (the counterpart of cancelEntityChanges).
// Create => create the entity (id is already in data).
// Update => apply newData.
// Delete => archive (symmetric with the archive convention used everywhere).
export async function applyEntityChanges<
  Entity extends { id: string; archived: boolean }
>(
  entityChanges: EntityChange<Entity>[] | undefined,
  methods: EntityApplyMethods<Entity>
): Promise<void> {
  if (!entityChanges) return

  for (const change of entityChanges) {
    if (change.type === EntityChangeType.Create) {
      await methods.create(change.data)
    } else if (change.type === EntityChangeType.Update) {
      const current = await methods.get(change.id)
      if (!current) throw new EntityChangeError(change.id)
      await methods.update(change.id, change.newData)
    } else if (change.type === EntityChangeType.Delete) {
      const current = await methods.get(change.id)
      if (!current) throw new EntityChangeError(change.id)
      await methods.update(change.id, { archived: true } as Partial<Entity>)
    }
  }
}
