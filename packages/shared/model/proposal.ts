import { EntitiesChanges, LogDisplay } from './log'

// A prepared org-chart change inside a proposal (not yet applied to the DB).
// Stored in the proposal activity data and replayed onto the org on approval.
export interface ProposalLog {
  id: string
  display: LogDisplay
  changes: EntitiesChanges
  // Set when replaying this log fails (e.g. a referenced entity no longer
  // exists). The proposal is invalid until the faulty log is removed.
  error?: string
}

export type ProposalDecisionMode =
  | 'consent' // approved if no objection
  | 'unanimity' // approved if everyone approves
  | 'simpleMajority' // approve > object (votes cast)
  | 'absoluteMajority' // approve > half of participants

export type ProposalStatus =
  | 'inProgress'
  | 'approved'
  | 'refused'
  | 'canceled'

// Who can vote on the proposal. 'circle' = the circle's participants (shown as
// "role" in the UI, but the data model attaches participants to a circle).
export type ProposalVotersScope = 'thread' | 'circle'

export type ProposalVoteValue = 'approve' | 'object' | 'abstain'

export interface ThreadActivityDataProposal {
  title: string
  description: string // rich text (markdown)
  decisionMode: ProposalDecisionMode
  votersScope: ProposalVotersScope
  allowAbstain: boolean // offer an abstain vote (ignored when decisionMode is 'consent')
  showVoters: boolean // reveal who voted what at resolution
  // Auto-resolve as soon as the outcome is certain (before everyone has voted)
  earlyResolution: boolean
  resolutionDate: string | null // ISO deadline, auto-resolved when reached
  logs: ProposalLog[] // prepared org-chart changes
  status: ProposalStatus
  resolvedAt: string | null
  appliedDecisionId: string | null // decision created in the circle registry on approval
}

export interface ProposalVoteResult {
  userId: string
  vote: ProposalVoteValue
}

// Generic event appended to the thread about a proposal (resolution,
// cancellation, vote reminder, ...).
export type ProposalEventType = 'resolution' | 'canceled' | 'voteReminder'

export interface ThreadActivityDataProposalEvent {
  proposalActivityId: string
  event: ProposalEventType
  // Resolution-specific (only when event === 'resolution')
  status?: 'approved' | 'refused'
  decisionMode?: ProposalDecisionMode
  votes?: ProposalVoteResult[]
  showVoters?: boolean // reveal who voted what (else show counts only)
  decisionId?: string | null
}
