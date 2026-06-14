import { Log, ThreadActivityFragment, Thread_Activity_Type_Enum } from '../gql'
import {
  ThreadActivityDataProposal,
  ThreadActivityDataProposalEvent,
} from './proposal'

/*** Thread Activity ***/

// Message
export interface ThreadActivityDataMessage {
  message: string
}

export interface ThreadActivityMessageFragment extends ThreadActivityFragment {
  type: Thread_Activity_Type_Enum.Message
  data: ThreadActivityDataMessage
}

// Poll
export interface ThreadActivityDataPoll {
  question: string
  choices: PollChoice[]
  multiple: boolean
  minAnswers: number | null
  maxAnswers: number | null
  pointsPerUser: number | null
  randomize: boolean
  anonymous: boolean
  hideUntilEnd: boolean
  canAddChoice: boolean
  endDate: string | null
  endWhenAllVoted: boolean
}

export interface ThreadActivityPollFragment extends ThreadActivityFragment {
  type: Thread_Activity_Type_Enum.Poll
  data: ThreadActivityDataPoll
}

export interface PollChoice {
  title: string
}

// Thread
export interface ThreadActivityThreadFragment extends ThreadActivityFragment {
  type: Thread_Activity_Type_Enum.Thread
}

// Meeting
export interface ThreadActivityMeetingFragment extends ThreadActivityFragment {
  type: Thread_Activity_Type_Enum.Meeting
}

// Meeting note
export interface ThreadActivityDataMeetingNote {
  notes: string
}

export interface ThreadActivityMeetingNoteFragment
  extends ThreadActivityFragment {
  type: Thread_Activity_Type_Enum.MeetingNote
  data: ThreadActivityDataMeetingNote
}

// Task
export interface ThreadActivityTaskFragment extends ThreadActivityFragment {
  type: Thread_Activity_Type_Enum.Task
}

// Decision
export interface ThreadActivityDecisionFragment extends ThreadActivityFragment {
  type: Thread_Activity_Type_Enum.Decision
}

// Changed Status
export interface ThreadActivityChangeStatusFragment
  extends ThreadActivityFragment {
  type: Thread_Activity_Type_Enum.ChangeStatus
  data: Log
}

// Proposal
export interface ThreadActivityProposalFragment extends ThreadActivityFragment {
  type: Thread_Activity_Type_Enum.Proposal
  data: ThreadActivityDataProposal
}

// Proposal event (resolution, edit, cancellation, vote reminder, ...)
export interface ThreadActivityProposalEventFragment
  extends ThreadActivityFragment {
  type: Thread_Activity_Type_Enum.ProposalEvent
  data: ThreadActivityDataProposalEvent
}
