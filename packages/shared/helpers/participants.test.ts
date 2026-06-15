import { describe, expect, it } from 'vitest'
import { orgData } from '../mocks/circles'

describe('Participants', () => {
  it('Alice Invited', () => {
    const currentMemberId = 'member-alice'
    const memberCircles = orgData
      .getParticipantCircles(currentMemberId)
      .map((circle) => circle.id)

    expect(memberCircles).includes('circle-super')
    expect(memberCircles).includes('circle-agence')
    expect(memberCircles).includes('circle-agence-leader')
    expect(memberCircles).includes('circle-agence-dev')
    expect(memberCircles).includes('circle-agence-dev-leader')
  })

  it('Bob Invited', () => {
    const currentMemberId = 'member-bob'
    const memberCircles = orgData
      .getParticipantCircles(currentMemberId)
      .map((circle) => circle.id)

    expect(memberCircles).includes('circle-agence')
    expect(memberCircles).includes('circle-agence-am')
    expect(memberCircles).includes('circle-agence-am-leader')
    expect(memberCircles).includes('circle-agence-dev')
    expect(memberCircles).includes('circle-agence-dev-facilitator')
  })

  it('Jean-Kévin Invited', () => {
    const currentMemberId = 'member-jean-kevin'
    const memberCircles = orgData
      .getParticipantCircles(currentMemberId)
      .map((circle) => circle.id)

    expect(memberCircles).includes('circle-super')
    expect(memberCircles).includes('circle-studio')
    expect(memberCircles).includes('circle-studio-leader')
    expect(memberCircles).includes('circle-agence-dev')
  })

  it('All participants of a circle', () => {
    const participantMemberIds = orgData
      .getParticipants('circle-agence-dev', true)
      .map((participant) => participant.member.id)

    expect(participantMemberIds).includes('member-alice')
    expect(participantMemberIds).includes('member-jean-kevin')
    expect(participantMemberIds).includes('member-pam')
  })
})
