import { Thread_Activity_Type_Enum, gql } from '../../gql'
import { adminRequest } from '../../utils/adminRequest'
import { userRequest } from '../../utils/userGraphqlRequest'
import { ParsedRoom } from './rooms'

// Markdown stored in the entity behind a room
export async function loadRoomContent(room: ParsedRoom): Promise<string> {
  switch (room.type) {
    case 'meetingStep': {
      const [id] = room.ids
      const data = await adminRequest(LOAD_MEETING_STEP, { id })
      return data.meeting_step_by_pk?.notes ?? ''
    }
    case 'meetingSummary': {
      const [id] = room.ids
      const data = await adminRequest(LOAD_MEETING, { id })
      return data.meeting_by_pk?.summary ?? ''
    }
    case 'taskDescription': {
      const [id] = room.ids
      const data = await adminRequest(LOAD_TASK, { id })
      return data.task_by_pk?.description ?? ''
    }
    case 'threadMeetingNote': {
      const [threadId, meetingId] = room.ids
      const data = await adminRequest(LOAD_THREAD_MEETING_NOTE, {
        threadId,
        meetingId,
      })
      return data.thread_activity[0]?.data?.notes ?? ''
    }
  }
}

// Save markdown in the entity behind a room, with the permissions of the
// user who made the last change
export async function saveRoomContent(
  room: ParsedRoom,
  markdown: string,
  userId: string
): Promise<void> {
  switch (room.type) {
    case 'meetingStep': {
      const [id] = room.ids
      await userRequest(userId, SAVE_MEETING_STEP, { id, notes: markdown })
      return
    }
    case 'meetingSummary': {
      const [id] = room.ids
      await userRequest(userId, SAVE_MEETING, { id, summary: markdown })
      return
    }
    case 'taskDescription': {
      const [id] = room.ids
      await userRequest(userId, SAVE_TASK, { id, description: markdown })
      return
    }
    case 'threadMeetingNote': {
      const [threadId, meetingId] = room.ids
      const data = { notes: markdown }
      const updated = await userRequest(userId, SAVE_THREAD_MEETING_NOTE, {
        threadId,
        meetingId,
        data,
      })
      if (updated.update_thread_activity?.affected_rows) return
      // No note yet: create it, unless there is nothing to save
      if (!markdown) return
      const { thread_by_pk } = await adminRequest(GET_THREAD_MEMBER, {
        threadId,
        userId,
      })
      const memberId = thread_by_pk?.org.members[0]?.id
      if (!memberId) throw new Error('Member not found')
      await userRequest(userId, CREATE_THREAD_MEETING_NOTE, {
        values: {
          threadId,
          memberId,
          type: Thread_Activity_Type_Enum.MeetingNote,
          refMeetingId: meetingId,
          data,
        },
      })
      return
    }
  }
}

const LOAD_MEETING_STEP = gql(`
  query collabLoadMeetingStep($id: uuid!) {
    meeting_step_by_pk(id: $id) {
      notes
    }
  }
`)

const SAVE_MEETING_STEP = gql(`
  mutation collabSaveMeetingStep($id: uuid!, $notes: String!) {
    update_meeting_step_by_pk(pk_columns: { id: $id }, _set: { notes: $notes }) {
      id
    }
  }
`)

const LOAD_MEETING = gql(`
  query collabLoadMeeting($id: uuid!) {
    meeting_by_pk(id: $id) {
      summary
    }
  }
`)

const SAVE_MEETING = gql(`
  mutation collabSaveMeeting($id: uuid!, $summary: String!) {
    update_meeting_by_pk(pk_columns: { id: $id }, _set: { summary: $summary }) {
      id
    }
  }
`)

const LOAD_TASK = gql(`
  query collabLoadTask($id: uuid!) {
    task_by_pk(id: $id) {
      description
    }
  }
`)

const SAVE_TASK = gql(`
  mutation collabSaveTask($id: uuid!, $description: String!) {
    update_task_by_pk(
      pk_columns: { id: $id }
      _set: { description: $description }
    ) {
      id
    }
  }
`)

const LOAD_THREAD_MEETING_NOTE = gql(`
  query collabLoadThreadMeetingNote($threadId: uuid!, $meetingId: uuid!) {
    thread_activity(
      where: {
        threadId: { _eq: $threadId }
        refMeetingId: { _eq: $meetingId }
        type: { _eq: MeetingNote }
      }
      order_by: { createdAt: asc }
      limit: 1
    ) {
      data
    }
  }
`)

const SAVE_THREAD_MEETING_NOTE = gql(`
  mutation collabSaveThreadMeetingNote(
    $threadId: uuid!
    $meetingId: uuid!
    $data: jsonb!
  ) {
    update_thread_activity(
      where: {
        threadId: { _eq: $threadId }
        refMeetingId: { _eq: $meetingId }
        type: { _eq: MeetingNote }
      }
      _set: { data: $data }
    ) {
      affected_rows
    }
  }
`)

const GET_THREAD_MEMBER = gql(`
  query collabGetThreadMember($threadId: uuid!, $userId: uuid!) {
    thread_by_pk(id: $threadId) {
      org {
        members(where: { userId: { _eq: $userId } }) {
          id
        }
      }
    }
  }
`)

const CREATE_THREAD_MEETING_NOTE = gql(`
  mutation collabCreateThreadMeetingNote($values: thread_activity_insert_input!) {
    insert_thread_activity_one(object: $values) {
      id
    }
  }
`)
