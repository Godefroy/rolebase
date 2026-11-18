import { gql } from '../../gql'
import { adminRequest } from '../../utils/adminRequest'
import { userRequest } from '../../utils/userGraphqlRequest'
import { ParsedRoom } from './rooms'

export interface RoomAccess {
  // The user can read the entity behind the room
  canRead: boolean
  // The user can update the entity, so they can apply changes to the room
  canEdit: boolean
}

// Read rights are checked with the user's Hasura permissions.
// Edit rights are checked with admin queries mirroring the update
// permissions in nhost/metadata: keep them in sync.
export async function getRoomAccess(
  room: ParsedRoom,
  userId: string
): Promise<RoomAccess> {
  switch (room.type) {
    case 'meetingStep': {
      const [id] = room.ids
      const [read, edit] = await Promise.all([
        userRequest(userId, READ_MEETING_STEP, { id }),
        adminRequest(EDIT_MEETING_STEP, { id, userId }),
      ])
      return toAccess(!!read.meeting_step_by_pk, edit.meeting_step.length > 0)
    }
    case 'meetingSummary': {
      const [id] = room.ids
      const [read, edit] = await Promise.all([
        userRequest(userId, READ_MEETING, { id }),
        adminRequest(EDIT_MEETING, { id, userId }),
      ])
      return toAccess(!!read.meeting_by_pk, edit.meeting.length > 0)
    }
    case 'taskDescription': {
      const [id] = room.ids
      const [read, edit] = await Promise.all([
        userRequest(userId, READ_TASK, { id }),
        adminRequest(EDIT_TASK, { id, userId }),
      ])
      return toAccess(!!read.task_by_pk, edit.task.length > 0)
    }
    case 'threadMeetingNote': {
      const [threadId, meetingId] = room.ids
      const [read, edit] = await Promise.all([
        userRequest(userId, READ_THREAD_MEETING, { threadId, meetingId }),
        adminRequest(EDIT_THREAD_MEETING_NOTE, { threadId, meetingId, userId }),
      ])
      return toAccess(
        !!read.thread_by_pk && !!read.meeting_by_pk,
        edit.thread.length > 0 || edit.thread_activity.length > 0
      )
    }
  }
}

function toAccess(canRead: boolean, canEdit: boolean): RoomAccess {
  return { canRead, canEdit: canRead && canEdit }
}

// Meeting step notes: public_meeting_step.yaml update filter
const READ_MEETING_STEP = gql(`
  query collabReadMeetingStep($id: uuid!) {
    meeting_step_by_pk(id: $id) {
      id
    }
  }
`)

const EDIT_MEETING_STEP = gql(`
  query collabEditMeetingStep($id: uuid!, $userId: uuid!) {
    meeting_step(
      where: {
        id: { _eq: $id }
        meeting: {
          _or: [
            { circle: { participants: { member: { userId: { _eq: $userId } } } } }
            {
              invitedReadonly: { _eq: false }
              meeting_attendees: { member: { userId: { _eq: $userId } } }
            }
          ]
        }
      }
    ) {
      id
    }
  }
`)

// Meeting summary: public_meeting.yaml update filter
const READ_MEETING = gql(`
  query collabReadMeeting($id: uuid!) {
    meeting_by_pk(id: $id) {
      id
    }
  }
`)

const EDIT_MEETING = gql(`
  query collabEditMeeting($id: uuid!, $userId: uuid!) {
    meeting(
      where: {
        id: { _eq: $id }
        _or: [
          { circle: { participants: { member: { userId: { _eq: $userId } } } } }
          {
            invitedReadonly: { _eq: false }
            meeting_attendees: { member: { userId: { _eq: $userId } } }
          }
          {
            private: { _eq: false }
            invitedReadonly: { _eq: false }
            org: {
              members: {
                userId: { _eq: $userId }
                role: { _in: [Member, Admin, Owner] }
              }
            }
          }
        ]
      }
    ) {
      id
    }
  }
`)

// Task description: public_task.yaml update filter
const READ_TASK = gql(`
  query collabReadTask($id: uuid!) {
    task_by_pk(id: $id) {
      id
    }
  }
`)

const EDIT_TASK = gql(`
  query collabEditTask($id: uuid!, $userId: uuid!) {
    task(
      where: {
        id: { _eq: $id }
        _or: [
          { circle: { participants: { member: { userId: { _eq: $userId } } } } }
          { member: { userId: { _eq: $userId } } }
          {
            private: { _eq: false }
            org: {
              members: {
                userId: { _eq: $userId }
                role: { _in: [Member, Admin, Owner] }
              }
            }
          }
        ]
      }
    ) {
      id
    }
  }
`)

// Thread notes taken in a meeting, stored in a MeetingNote thread_activity:
// public_thread_activity.yaml update filter
const READ_THREAD_MEETING = gql(`
  query collabReadThreadMeeting($threadId: uuid!, $meetingId: uuid!) {
    thread_by_pk(id: $threadId) {
      id
    }
    meeting_by_pk(id: $meetingId) {
      id
    }
  }
`)

const EDIT_THREAD_MEETING_NOTE = gql(`
  query collabEditThreadMeetingNote(
    $threadId: uuid!
    $meetingId: uuid!
    $userId: uuid!
  ) {
    thread(
      where: {
        id: { _eq: $threadId }
        _or: [
          { circle: { participants: { member: { userId: { _eq: $userId } } } } }
          { extra_members: { member: { userId: { _eq: $userId } } } }
          {
            private: { _eq: false }
            org: {
              members: {
                userId: { _eq: $userId }
                role: { _in: [Member, Admin, Owner] }
              }
            }
          }
        ]
      }
    ) {
      id
    }
    thread_activity(
      where: {
        threadId: { _eq: $threadId }
        refMeetingId: { _eq: $meetingId }
        type: { _eq: MeetingNote }
        userId: { _eq: $userId }
      }
    ) {
      id
    }
  }
`)
