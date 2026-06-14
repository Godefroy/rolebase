import { ProposalDecisionMode } from '../model/proposal'

interface Vote {
  vote: string // 'approve' | 'object' | 'abstain' (stored as text)
}

// Determine whether a proposal is approved given its decision mode, the votes
// cast and the number of participants. Centralized so the rule is easy to tune.
export function resolveProposal(
  mode: ProposalDecisionMode,
  votes: Vote[],
  participantsCount: number
): { approved: boolean } {
  const approve = votes.filter((v) => v.vote === 'approve').length
  const object = votes.filter((v) => v.vote === 'object').length

  switch (mode) {
    case 'consent':
      // Passes unless someone objects
      return { approved: object === 0 }
    case 'unanimity':
      // Everyone must approve, nobody objects
      return { approved: approve === participantsCount && object === 0 }
    case 'simpleMajority':
      return { approved: approve > object }
    case 'absoluteMajority':
      return { approved: approve > participantsCount / 2 }
  }
}

// Whether the outcome can no longer change, whatever the remaining voters do.
// Used for early resolution. For every supported mode, the result is monotonic
// in approvals vs objections, so it is enough to check the two extreme
// completions (all remaining approve vs all remaining object): if they agree,
// every intermediate distribution (including abstentions) agrees too.
export function isResultCertain(
  mode: ProposalDecisionMode,
  votes: Vote[],
  participantsCount: number
): boolean {
  const remaining = Math.max(0, participantsCount - votes.length)
  if (remaining === 0) return true

  const fill = (vote: string) =>
    votes.concat(Array.from({ length: remaining }, () => ({ vote })))

  const best = resolveProposal(mode, fill('approve'), participantsCount).approved
  const worst = resolveProposal(mode, fill('object'), participantsCount).approved
  return best === worst
}
