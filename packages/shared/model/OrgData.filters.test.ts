import { describe, expect, it } from 'vitest'
import { ThreadFragment } from '../gql'
import { orgData } from '../mocks/circles'
import { EntityWithScope, ParticipantsScope } from './participants'

// member-pam is a direct member of circle-agence-dev only.
// Its participant circles are [circle-agence-dev], with ancestors
// circle-super and circle-agence.
const MEMBER = 'member-pam'

const scope = (over: Partial<ParticipantsScope> = {}): ParticipantsScope => ({
  members: [],
  circles: [],
  ...over,
})

const entity = (s: ParticipantsScope): EntityWithScope => ({ scope: s })

const thread = (
  circleId: string,
  extraMemberIds: string[] = []
): ThreadFragment =>
  ({
    id: `thread-${circleId}`,
    orgId: 'org-1',
    circleId,
    extra_members: extraMemberIds.map((memberId, i) => ({
      id: `em-${i}`,
      threadId: `thread-${circleId}`,
      memberId,
    })),
  }) as ThreadFragment

describe('OrgData filters', () => {
  describe('filterScopedEntities', () => {
    it('returns everything when no member is given', () => {
      const data = [entity(scope()), entity(scope())]
      expect(orgData.filterScopedEntities(data)).toBe(data)
    })

    it('keeps entities scoped to the member directly', () => {
      const e = entity(scope({ members: [MEMBER] }))
      expect(orgData.filterScopedEntities([e], MEMBER)).toEqual([e])
    })

    it('keeps entities scoped to one of the member circles', () => {
      const e = entity(
        scope({
          circles: [
            { id: 'circle-agence-dev', children: false, excludeMembers: [] },
          ],
        })
      )
      expect(orgData.filterScopedEntities([e], MEMBER)).toEqual([e])
    })

    it('excludes entities scoped to an unrelated circle', () => {
      const e = entity(
        scope({
          circles: [
            { id: 'circle-studio', children: false, excludeMembers: [] },
          ],
        })
      )
      expect(orgData.filterScopedEntities([e], MEMBER)).toEqual([])
    })

    it('matches an ancestor circle only when children is enabled', () => {
      const withChildren = entity(
        scope({
          circles: [
            { id: 'circle-agence', children: true, excludeMembers: [] },
          ],
        })
      )
      const withoutChildren = entity(
        scope({
          circles: [
            { id: 'circle-agence', children: false, excludeMembers: [] },
          ],
        })
      )
      expect(orgData.filterScopedEntities([withChildren], MEMBER)).toEqual([
        withChildren,
      ])
      expect(orgData.filterScopedEntities([withoutChildren], MEMBER)).toEqual([])
    })

    it('excludes the member when listed in excludeMembers', () => {
      const e = entity(
        scope({
          circles: [
            {
              id: 'circle-agence-dev',
              children: false,
              excludeMembers: [MEMBER],
            },
          ],
        })
      )
      expect(orgData.filterScopedEntities([e], MEMBER)).toEqual([])
    })
  })

  describe('filterThreads', () => {
    it('returns everything when no member is given', () => {
      const threads = [thread('circle-studio')]
      expect(orgData.filterThreads(threads)).toBe(threads)
    })

    it('keeps threads of a member circle', () => {
      const t = thread('circle-agence-dev')
      expect(orgData.filterThreads([t], MEMBER)).toEqual([t])
    })

    it('keeps threads where the member is an extra member', () => {
      const t = thread('circle-studio', [MEMBER])
      expect(orgData.filterThreads([t], MEMBER)).toEqual([t])
    })

    it('excludes threads of unrelated circles', () => {
      const t = thread('circle-studio')
      expect(orgData.filterThreads([t], MEMBER)).toEqual([])
    })
  })
})
