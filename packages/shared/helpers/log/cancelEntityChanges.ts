import {
  EntityChange,
  EntityChangeType,
  EntityMethodGet,
  EntityMethodUpdate,
} from '../../model/log'

export async function cancelEntityChanges<
  Entity extends { archivedAt?: string | null }
>(
  entityChanges: EntityChange<Entity>[] | undefined,
  getEntity: EntityMethodGet<Entity>,
  updateEntity: EntityMethodUpdate<Entity>
): Promise<EntityChange<Entity>[]> {
  if (!entityChanges) return []
  const changes: EntityChange<Entity>[] = []

  for (const entityChange of entityChanges) {
    const currentEntity = await getEntity(entityChange.id)
    if (!currentEntity) {
      console.error('Entity not found', entityChange.id)
      continue
    }

    if (entityChange.type === EntityChangeType.Create) {
      // Revert creation = archive entity
      if (currentEntity.archivedAt) {
        continue
      }
      const archivedAt = new Date().toISOString()
      await updateEntity(entityChange.id, { archivedAt } as Partial<Entity>)
      changes.push({
        type: EntityChangeType.Update,
        id: entityChange.id,
        prevData: { archivedAt: null } as Partial<Entity>,
        newData: { archivedAt } as Partial<Entity>,
      })
    } else if (entityChange.type === EntityChangeType.Update) {
      // Revert update
      const changePrevData: Partial<Entity> = {}
      for (const key in entityChange.prevData) {
        changePrevData[key] = currentEntity[key]
      }
      await updateEntity(entityChange.id, entityChange.prevData)
      changes.push({
        type: EntityChangeType.Update,
        id: entityChange.id,
        prevData: changePrevData,
        newData: entityChange.prevData,
      })
    }
  }
  return changes
}
