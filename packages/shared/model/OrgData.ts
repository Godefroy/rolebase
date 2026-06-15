import {
  CircleFragment,
  CircleLinkFragment,
  CircleMemberFragment,
  MemberFragment,
  RoleSummaryFragment,
  ThreadFragment,
} from '../gql'
import { Participant } from '../model/member'
import { EntityWithScope, ParticipantsScope } from '../model/participants'

// A circle member joined with its member entity.
export interface CircleMemberJoined {
  id: string
  member: MemberFragment
}

// The current member acting as a leader of a circle (proposal editor): they are
// added to that circle's leaders, which propagates to participants and to the
// owner checks of its sub-circles.
export interface ActingLeader {
  circleId: string
  member: MemberFragment
}

const byName = (a: { name: string }, b: { name: string }) =>
  a.name.localeCompare(b.name)

// Indexed view of an org's structure: the single org data object, holding the
// active entities and the lookups + operations over them. Nothing materializes
// a nested CircleFull tree anymore.
//
// Instances are immutable after construction (callers always create a fresh
// OrgData rather than mutating one), so pure traversals are memoized on demand.
// All accessors return readonly views: never mutate them, doing so would corrupt
// the indexes and caches.
export class OrgData {
  // Active entities (archived filtered out), members sorted by name
  readonly circles: readonly CircleFragment[]
  readonly members: readonly MemberFragment[]
  readonly roles: readonly RoleSummaryFragment[]

  // By-id lookups (also index archived circles/roles, so an archived
  // circle/role can still be resolved when its panel is opened)
  readonly circleById: ReadonlyMap<string, CircleFragment>
  readonly roleById: ReadonlyMap<string, RoleSummaryFragment>
  readonly memberById: ReadonlyMap<string, MemberFragment>

  // Forward and inverse relation indexes
  private readonly membersByCircle = new Map<string, CircleMemberJoined[]>()
  private readonly linksByCircle = new Map<string, CircleLinkFragment[]>()
  private readonly childrenByCircle = new Map<string, CircleFragment[]>()
  private readonly circlesByMember = new Map<string, CircleFragment[]>()

  // On-demand caches for pure derivations
  private readonly hueCache = new Map<string, number | null>()
  private readonly leadersCache = new Map<string, readonly Participant[]>()
  private readonly participantsCache = new Map<string, readonly Participant[]>()
  private readonly deepParticipantsCache = new Map<
    string,
    readonly Participant[]
  >()
  private readonly participantCirclesCache = new Map<
    string,
    readonly CircleFragment[]
  >()
  private activeMembersList?: readonly MemberFragment[]

  constructor(
    circles: CircleFragment[],
    circleMembers: CircleMemberFragment[],
    circleLinks: CircleLinkFragment[],
    roles: RoleSummaryFragment[],
    members: MemberFragment[],
    private readonly actingLeader?: ActingLeader
  ) {
    // Exclude archived circles: the subscription returns only active ones, but
    // the proposal draft marks circles archived in place (in-memory "delete").
    const activeCircles = circles.filter((c) => !c.archived)
    this.circles = activeCircles
    this.members = [...members].sort(byName)
    this.roles = roles
    this.circleById = new Map(activeCircles.map((c) => [c.id, c]))
    this.roleById = new Map(roles.map((r) => [r.id, r]))
    this.memberById = new Map(this.members.map((m) => [m.id, m]))

    for (const cm of circleMembers) {
      if (cm.archived) continue
      const circle = this.circleById.get(cm.circleId)
      if (!circle) continue
      const member = this.memberById.get(cm.memberId)
      if (!member) continue

      // Forward: members of a circle
      const list = this.membersByCircle.get(cm.circleId)
      const entry = { id: cm.id, member }
      if (list) list.push(entry)
      else this.membersByCircle.set(cm.circleId, [entry])

      // Inverse: circles a member is a direct member of
      const circleList = this.circlesByMember.get(cm.memberId)
      if (circleList) circleList.push(circle)
      else this.circlesByMember.set(cm.memberId, [circle])
    }

    for (const cl of circleLinks) {
      if (cl.archived || !this.circleById.has(cl.parentId)) continue
      const list = this.linksByCircle.get(cl.parentId)
      if (list) list.push(cl)
      else this.linksByCircle.set(cl.parentId, [cl])
    }

    for (const c of activeCircles) {
      if (!c.parentId) continue
      const list = this.childrenByCircle.get(c.parentId)
      if (list) list.push(c)
      else this.childrenByCircle.set(c.parentId, [c])
    }
  }

  // ---- Internal helpers ----

  // Direct parent of a circle, if any.
  private parentOf(circle: CircleFragment): CircleFragment | undefined {
    return circle.parentId ? this.circleById.get(circle.parentId) : undefined
  }

  // Whether a circle represents its parent (a "representant" / parent link).
  private isParentLink(circle: CircleFragment): boolean {
    return !!this.roleById.get(circle.roleId)?.parentLink
  }

  // Members representing a circle through its parent-link sub-circles.
  private representativesOf(circleId: string): Participant[] {
    return this.childrenOf(circleId)
      .filter((c) => this.isParentLink(c))
      .flatMap((c) =>
        this.membersOf(c.id).map(
          ({ member }): Participant => ({ circleId: c.id, member })
        )
      )
  }

  // ---- By-id lookups ----

  getCircle(id?: string): CircleFragment | undefined {
    return id ? this.circleById.get(id) : undefined
  }
  getRole(id?: string): RoleSummaryFragment | undefined {
    return id ? this.roleById.get(id) : undefined
  }
  getMember(id?: string): MemberFragment | undefined {
    return id ? this.memberById.get(id) : undefined
  }
  // Members linked to a user account (those who have actually joined).
  getActiveMembers(): readonly MemberFragment[] {
    return (this.activeMembersList ??= this.members.filter((m) => !!m.userId))
  }

  // ---- Relations ----

  membersOf(circleId: string): readonly CircleMemberJoined[] {
    return this.membersByCircle.get(circleId) ?? []
  }
  linksOf(circleId: string): readonly CircleLinkFragment[] {
    return this.linksByCircle.get(circleId) ?? []
  }
  // Circles that invited a circle through a link (the link host circles).
  invitingCirclesOf(circleId: string): readonly CircleFragment[] {
    return this.circles.filter((c) =>
      this.linksOf(c.id).some((link) => link.circleId === circleId)
    )
  }
  // Circles invited into a circle through its links.
  invitedCirclesOf(circleId: string): readonly CircleFragment[] {
    return this.linksOf(circleId)
      .map((link) => this.circleById.get(link.circleId))
      .filter((c): c is CircleFragment => c !== undefined)
  }
  // Direct children of a circle.
  childrenOf(circleId: string): readonly CircleFragment[] {
    return this.childrenByCircle.get(circleId) ?? []
  }
  // All descendants of a circle (children, recursively).
  descendantsOf(circleId: string): readonly CircleFragment[] {
    return this.childrenOf(circleId).flatMap((c) => [
      c,
      ...this.descendantsOf(c.id),
    ])
  }
  // Ancestors of a circle, from the root down to its direct parent.
  parentsOf(circle: CircleFragment): readonly CircleFragment[] {
    const parents: CircleFragment[] = []
    let parent = this.parentOf(circle)
    while (parent) {
      parents.unshift(parent)
      parent = this.parentOf(parent)
    }
    return parents
  }
  // Ancestors of a circle plus the circle itself (root first).
  andParentsOf(circleId: string): readonly CircleFragment[] {
    const circle = this.circleById.get(circleId)
    if (!circle) return []
    return [...this.parentsOf(circle), circle]
  }

  // ---- Color ----

  // Resolve a circle's color hue on demand: its role's colorHue, or the nearest
  // parent whose role defines one. Cached per circle.
  getColor(circleId: string): number | null {
    const cached = this.hueCache.get(circleId)
    if (cached !== undefined) return cached

    let current: CircleFragment | undefined = this.circleById.get(circleId)
    let hue: number | null = null
    while (current) {
      const role = this.roleById.get(current.roleId)
      if (role && typeof role.colorHue === 'number') {
        hue = role.colorHue
        break
      }
      current = this.parentOf(current)
    }

    this.hueCache.set(circleId, hue)
    return hue
  }

  // ---- Participants ----

  getLeaders(circleId: string): readonly Participant[] {
    if (!this.circleById.has(circleId)) return []

    const cached = this.leadersCache.get(circleId)
    if (cached) return cached

    // Sub-circle leaders (parent-link circles)
    const leaders = this.representativesOf(circleId)

    // If no representant, take direct members
    let result =
      leaders.length !== 0
        ? leaders
        : this.membersOf(circleId).map(
            ({ member }): Participant => ({ circleId, member })
          )

    // Acting leader (proposal editor): current member acts as a leader here
    const acting = this.actingLeader
    if (
      acting &&
      acting.circleId === circleId &&
      !result.some((p) => p.member.id === acting.member.id)
    ) {
      result = [...result, { circleId, member: acting.member }]
    }

    this.leadersCache.set(circleId, result)
    return result
  }

  getParticipants(
    circleId: string,
    includeChildren = false
  ): readonly Participant[] {
    if (includeChildren) {
      const cached = this.deepParticipantsCache.get(circleId)
      if (cached) return cached

      const participants = this.getParticipants(circleId)
      const subCirclesParticipants = this.childrenOf(circleId)
        // Skip leaders (already in participants)
        .filter((c) => !this.isParentLink(c))
        .flatMap((c) => this.getParticipants(c.id, true))
      const result = [...subCirclesParticipants, ...participants]

      this.deepParticipantsCache.set(circleId, result)
      return result
    }

    if (!this.circleById.has(circleId)) return []

    const cached = this.participantsCache.get(circleId)
    if (cached) return cached

    let hasLeader = false

    // Leaders of roles and sub-circles
    const leaders = this.childrenOf(circleId).flatMap((c) => {
      if (this.isParentLink(c)) {
        const cMembers = this.membersOf(c.id)
        if (cMembers.length > 0) hasLeader = true
        return cMembers.map(
          ({ member }): Participant => ({
            circleId: c.id,
            member,
            leader: true,
          })
        )
      } else {
        return this.getLeaders(c.id).map((p) => ({ ...p, circleId: c.id }))
      }
    })

    // Direct members
    const directParticipants = this.membersOf(circleId).map(
      ({ member }): Participant => ({ circleId, member, leader: !hasLeader })
    )

    // Links to other circles
    const links = this.linksOf(circleId)
      .flatMap((link) =>
        this.getLeaders(link.circleId).map((p) => ({
          ...p,
          circleId: link.circleId,
        }))
      )
      .map((p) => ({ ...p, invited: true }))

    const result = [...leaders, ...directParticipants, ...links]
    this.participantsCache.set(circleId, result)
    return result
  }

  // Circles where a member participates (directly or as a representant)
  getParticipantCircles(memberId: string): readonly CircleFragment[] {
    const cached = this.participantCirclesCache.get(memberId)
    if (cached) return cached

    const directMemberCircles = this.circlesByMember.get(memberId) ?? []

    const leaderCircles: CircleFragment[] = []

    const participantCircles = directMemberCircles.reduce<CircleFragment[]>(
      (acc, circle) => {
        const parent = this.parentOf(circle)
        if (!parent) return acc

        const hasLeader = this.childrenOf(circle.id).some(
          (child) =>
            this.isParentLink(child) && this.membersOf(child.id).length > 0
        )
        if (hasLeader) return acc

        acc.push(parent)

        if (this.isParentLink(circle)) {
          const grandParent = this.parentOf(parent)
          if (grandParent) acc.push(grandParent)
          leaderCircles.push(parent)
        }
        return acc
      },
      []
    )

    const invitedCircles = this.circles.filter((circle) =>
      this.linksOf(circle.id).some((link) =>
        leaderCircles.some((c) => link.circleId === c.id)
      )
    )

    const result = [
      ...directMemberCircles,
      ...participantCircles,
      ...invitedCircles,
    ]
    this.participantCirclesCache.set(memberId, result)
    return result
  }

  // Member ids included in a participants scope
  getScopeMemberIds(scope: ParticipantsScope): string[] {
    const memberIds = new Set(scope.members)

    for (const circle of scope.circles) {
      const participants = this.getParticipants(circle.id, !!circle.children)
      for (const participant of participants) {
        const memberId = participant.member.id
        if (circle.excludeMembers.includes(memberId)) continue
        memberIds.add(memberId)
      }
    }

    return [...memberIds]
  }

  // ---- Filters by member ----

  filterScopedEntities<Entity extends EntityWithScope>(
    data: Entity[],
    memberId?: string
  ): Entity[] {
    if (!memberId) return data

    const memberCircles = this.getParticipantCircles(memberId)
    const memberCirclesIds = new Set(memberCircles.map((c) => c.id))
    const memberParentCircleIds = new Set(
      memberCircles.flatMap((circle) => this.parentsOf(circle).map((c) => c.id))
    )

    return data.filter(
      ({ scope }) =>
        scope.members.includes(memberId) ||
        scope.circles.some(
          ({ id, children, excludeMembers }) =>
            !excludeMembers.includes(memberId) &&
            (memberCirclesIds.has(id) ||
              (children && memberParentCircleIds.has(id)))
        )
    )
  }

  filterThreads<Entity extends ThreadFragment>(
    threads: Entity[],
    memberId?: string
  ): Entity[] {
    if (!memberId) return threads

    const memberCirclesIds = new Set(
      this.getParticipantCircles(memberId).map((c) => c.id)
    )

    return threads.filter(
      ({ circleId, extra_members }) =>
        extra_members.some((em) => em.memberId === memberId) ||
        memberCirclesIds.has(circleId)
    )
  }
}
