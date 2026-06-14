import { EntitiesApplyMethods, EntitiesChanges } from '../../model/log'
import { applyEntitiesChanges } from './applyEntitiesChanges'

export interface ReplayableLog {
  id: string
  changes: EntitiesChanges
}

// Replay a list of logs in order onto a source, isolating failures per log.
// A log whose changes reference a missing entity is reported in failedLogIds
// (the proposal is then invalid until that log is removed).
export async function replayLogs(
  logs: ReplayableLog[],
  methods: EntitiesApplyMethods
): Promise<{ failedLogIds: string[] }> {
  const failedLogIds: string[] = []
  for (const log of logs) {
    try {
      await applyEntitiesChanges(log.changes, methods)
    } catch (error) {
      failedLogIds.push(log.id)
    }
  }
  return { failedLogIds }
}
