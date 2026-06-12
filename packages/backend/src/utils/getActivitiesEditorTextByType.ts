// Get the text from the JSON editor based on the type of activity
// This is used to search message or question from the activities
// Check if json parse is valid and if the root exists

import {
  ThreadActivityDataMeetingNote,
  ThreadActivityDataMessage,
  ThreadActivityDataPoll,
} from '@rolebase/shared/model/thread_activity'
import { Thread_Activity_Type_Enum } from '../gql'
import getEditorText from './getEditorText'

export default function getActivitiesEditorTextByType(
  data: any,
  type: Thread_Activity_Type_Enum
): string {
  try {
    switch (type) {
      case Thread_Activity_Type_Enum.Message: {
        const { message } = data as ThreadActivityDataMessage
        return getEditorText(message)
      }
      case Thread_Activity_Type_Enum.Poll: {
        const { question } = data as ThreadActivityDataPoll
        return getEditorText(question)
      }
      case Thread_Activity_Type_Enum.MeetingNote: {
        const { notes } = data as ThreadActivityDataMeetingNote
        return getEditorText(notes)
      }
    }
  } catch (error) {
    console.error(error)
  }
  return ''
}
