import { describe, expect, it } from 'vitest'
import { parseRoom } from './rooms'

const id1 = '0b6f3c2e-1d4a-4b8e-9f2a-3c5d7e9f1a2b'
const id2 = '9a8b7c6d-5e4f-4a3b-8c2d-1e0f9a8b7c6d'

describe('parseRoom', () => {
  it('parses every room type', () => {
    expect(parseRoom(`meeting-step-${id1}`)).toMatchObject({
      type: 'meetingStep',
      ids: [id1],
    })
    expect(parseRoom(`meeting-${id1}-summary`)).toMatchObject({
      type: 'meetingSummary',
      ids: [id1],
    })
    expect(parseRoom(`task-${id1}-description`)).toMatchObject({
      type: 'taskDescription',
      ids: [id1],
    })
    expect(parseRoom(`thread-${id1}-meeting-${id2}`)).toMatchObject({
      type: 'threadMeetingNote',
      ids: [id1, id2],
    })
  })

  it('rejects unknown names', () => {
    expect(parseRoom(`task-${id1.toUpperCase()}-description`)).toBeUndefined()
    expect(parseRoom(`task-${id1}-title`)).toBeUndefined()
    expect(parseRoom(`x-task-${id1}-description`)).toBeUndefined()
    expect(parseRoom(`task-${id1}-description-v2`)).toBeUndefined()
    expect(parseRoom('')).toBeUndefined()
  })
})
