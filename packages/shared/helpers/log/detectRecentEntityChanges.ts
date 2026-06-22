import isEqual from 'lodash.isequal'
import {
  EntityChange,
  EntityChangeType,
  EntityMethodGet,
} from '../../model/log'

const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/

// Compare two logged values. Timestamps are compared by instant, not by string,
// so the same moment serialized differently (e.g. "...Z" vs "...+00:00") is not
// mistaken for a change.
function valuesEqual(a: unknown, b: unknown): boolean {
  if (
    typeof a === 'string' &&
    typeof b === 'string' &&
    ISO_DATE_RE.test(a) &&
    ISO_DATE_RE.test(b)
  ) {
    return new Date(a).getTime() === new Date(b).getTime()
  }
  return isEqual(a, b)
}

export async function detectRecentEntityChanges<Entity>(
  entityChanges: EntityChange<Entity>[],
  getEntity: EntityMethodGet<Entity>
): Promise<boolean> {
  for (const entityChange of entityChanges) {
    // Entity update
    if (entityChange.type === EntityChangeType.Update) {
      const currentEntity = await getEntity(entityChange.id)
      if (!currentEntity) return false

      // Check properties that have changed
      for (const key in entityChange.newData) {
        const value = currentEntity[key]
        const newValue = entityChange.newData[key]
        if (!valuesEqual(value, newValue)) {
          return true
        }
      }
    }
  }
  return false
}
