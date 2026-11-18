// Rooms are named after the docId built by the webapp
// (see the `docId` props passed to CollabEditor). Any other name is rejected.

export type RoomType =
  | 'meetingStep'
  | 'meetingSummary'
  | 'taskDescription'
  | 'threadMeetingNote'

export interface ParsedRoom {
  name: string
  type: RoomType
  // Entity ids captured from the name
  ids: string[]
}

const uuid = '([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})'

const roomPatterns: Record<RoomType, RegExp> = {
  // meeting-step-<stepId>
  meetingStep: new RegExp(`^meeting-step-${uuid}$`),
  // meeting-<meetingId>-summary
  meetingSummary: new RegExp(`^meeting-${uuid}-summary$`),
  // task-<taskId>-description
  taskDescription: new RegExp(`^task-${uuid}-description$`),
  // thread-<threadId>-meeting-<meetingId>
  threadMeetingNote: new RegExp(`^thread-${uuid}-meeting-${uuid}$`),
}

// Returns undefined for unknown room names
export function parseRoom(name: string): ParsedRoom | undefined {
  for (const [type, pattern] of Object.entries(roomPatterns)) {
    const match = pattern.exec(name)
    if (match) return { name, type: type as RoomType, ids: match.slice(1) }
  }
  return undefined
}
