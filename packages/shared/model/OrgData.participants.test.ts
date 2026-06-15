import { describe, expect, it } from 'vitest'
import { orgData } from '../mocks/circles'
import { ParticipantsScope } from './participants'

describe('OrgData participants', () => {
  describe('getParticipantCircles', () => {
    it('Alice Invited', () => {
      const currentMemberId = 'member-alice'
      const memberCircles = orgData
        .getParticipantCircles(currentMemberId)
        .map((circle) => circle.id)

      expect(memberCircles).toContain('circle-super')
      expect(memberCircles).toContain('circle-agence')
      expect(memberCircles).toContain('circle-agence-leader')
      expect(memberCircles).toContain('circle-agence-dev')
      expect(memberCircles).toContain('circle-agence-dev-leader')
    })

    it('Bob Invited', () => {
      const currentMemberId = 'member-bob'
      const memberCircles = orgData
        .getParticipantCircles(currentMemberId)
        .map((circle) => circle.id)

      expect(memberCircles).toContain('circle-agence')
      expect(memberCircles).toContain('circle-agence-am')
      expect(memberCircles).toContain('circle-agence-am-leader')
      expect(memberCircles).toContain('circle-agence-dev')
      expect(memberCircles).toContain('circle-agence-dev-facilitator')
    })

    it('Jean-Kévin Invited', () => {
      const currentMemberId = 'member-jean-kevin'
      const memberCircles = orgData
        .getParticipantCircles(currentMemberId)
        .map((circle) => circle.id)

      expect(memberCircles).toContain('circle-super')
      expect(memberCircles).toContain('circle-studio')
      expect(memberCircles).toContain('circle-studio-leader')
      expect(memberCircles).toContain('circle-agence-dev')
    })

    it('returns no circles for an unknown member', () => {
      expect(orgData.getParticipantCircles('unknown')).toEqual([])
    })
  })

  describe('getLeaders', () => {
    it('takes leaders from the parent-link sub-circle', () => {
      // circle-agence-dev-leader is a parentLink circle with Alice
      const leaders = orgData
        .getLeaders('circle-agence-dev')
        .map((p) => p.member.id)
      expect(leaders).toEqual(['member-alice'])
    })

    it('falls back to direct members when there is no representant', () => {
      const leaders = orgData
        .getLeaders('circle-agence-dev-facilitator')
        .map((p) => p.member.id)
      expect(leaders).toEqual(['member-bob'])
    })

    it('returns no leaders for an unknown circle', () => {
      expect(orgData.getLeaders('unknown')).toEqual([])
    })
  })

  describe('getParticipants', () => {
    it('All participants of a circle (including children)', () => {
      const participantMemberIds = orgData
        .getParticipants('circle-agence-dev', true)
        .map((participant) => participant.member.id)

      expect(participantMemberIds).toContain('member-alice')
      expect(participantMemberIds).toContain('member-jean-kevin')
      expect(participantMemberIds).toContain('member-pam')
      expect(participantMemberIds).toContain('member-bob')
    })

    it('returns no participants for an unknown circle', () => {
      expect(orgData.getParticipants('unknown')).toEqual([])
    })
  })

  describe('getScopeMemberIds', () => {
    it('merges explicit members and circle participants without duplicates', () => {
      const scope: ParticipantsScope = {
        members: ['member-alice'],
        circles: [
          { id: 'circle-agence-dev', children: true, excludeMembers: [] },
        ],
      }
      const ids = orgData.getScopeMemberIds(scope)

      expect(ids).toContain('member-alice')
      expect(ids).toContain('member-bob')
      expect(ids).toContain('member-jean-kevin')
      expect(ids).toContain('member-pam')
      // Alice appears both as explicit member and as participant: only once
      expect(ids.filter((id) => id === 'member-alice')).toHaveLength(1)
    })

    it('skips excluded members of a circle scope', () => {
      const scope: ParticipantsScope = {
        members: [],
        circles: [
          {
            id: 'circle-agence-dev',
            children: true,
            excludeMembers: ['member-bob'],
          },
        ],
      }
      expect(orgData.getScopeMemberIds(scope)).not.toContain('member-bob')
    })
  })
})
