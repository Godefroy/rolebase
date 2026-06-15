import { truthy } from '@rolebase/shared/helpers/truthy'
import { ThreadActivityDataProposal } from '@rolebase/shared/model/proposal'
import { gql } from '../../gql'
import { adminRequest } from '../../utils/adminRequest'
import { loadOrgData } from '../org/loadOrgData'

const GET_PROPOSAL = gql(`
  query getProposalForResolution($id: uuid!) {
    thread_activity_by_pk(id: $id) {
      id
      userId
      threadId
      type
      data
      thread {
        id
        orgId
        circleId
        extra_members {
          memberId
          member {
            id
            userId
          }
        }
      }
    }
  }
`)

const GET_VOTES = gql(`
  query getProposalVotesForResolution($activityId: uuid!) {
    thread_proposal_vote(where: { activityId: { _eq: $activityId } }) {
      userId
      vote
    }
  }
`)

export interface LoadedProposal {
  activityId: string
  authorUserId: string
  threadId: string
  orgId: string
  circleId: string
  data: ThreadActivityDataProposal
  voterUserIds: string[]
  leaderUserIds: string[]
  votes: { userId: string; vote: string }[]
}

// Load everything needed to decide and apply a proposal resolution.
// Returns null if the activity is not an in-progress proposal.
export async function loadProposal(
  activityId: string
): Promise<LoadedProposal | null> {
  const { thread_activity_by_pk: activity } = await adminRequest(GET_PROPOSAL, {
    id: activityId,
  })
  if (!activity || activity.type !== 'Proposal' || !activity.thread) return null

  const data = activity.data as ThreadActivityDataProposal
  const thread = activity.thread

  const [orgData, { thread_proposal_vote: votes }] = await Promise.all([
    loadOrgData(thread.orgId),
    adminRequest(GET_VOTES, { activityId }),
  ])

  // Voters: circle participants, plus thread extra members when scope is 'thread'
  const participants = orgData.getParticipants(thread.circleId)
  const voterUserIds = new Set(
    participants.map((p) => p.member.userId).filter(truthy)
  )
  if (data.votersScope === 'thread') {
    for (const extra of thread.extra_members) {
      if (extra.member?.userId) voterUserIds.add(extra.member.userId)
    }
  }

  const leaders = orgData.getLeaders(thread.circleId)
  const leaderUserIds = new Set(
    leaders.map((p) => p.member.userId).filter(truthy)
  )

  return {
    activityId: activity.id,
    authorUserId: activity.userId,
    threadId: thread.id,
    orgId: thread.orgId,
    circleId: thread.circleId,
    data,
    voterUserIds: [...voterUserIds],
    leaderUserIds: [...leaderUserIds],
    votes,
  }
}
