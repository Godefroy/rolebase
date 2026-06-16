import type {
  CircleFragment,
  CircleLinkFragment,
  CircleMemberFragment,
  MemberFragment,
  RoleFragment,
} from '@rolebase/shared/gql'
import { OrgData } from '@rolebase/shared/model/OrgData'

// Static, backend-free example organizations used by the website islands:
// - the read-only documentation graph (OrgChartView)
// - the editable homepage demo, which seeds an in-memory proposal draft from
//   these fragments.
//
// The structure (hierarchy, members, colors, avatars) lives here; all
// user-facing role text is translated and passed in from the i18n files
// (`src/content/translations/*.yaml`, key `demo`) by the Astro wrapper.
// Member avatars are served from /public/demo-avatars by absolute URL so the
// client island renders them without bundler processing.

export type DemoOrgKey = 'demo' | 'simple'

const ORG_ID = 'demo-org'

// --- Translated text (shape of the `demo` i18n subtree) -------------------

export interface DemoRoleText {
  name: string
  purpose?: string
  domain?: string
  accountabilities?: string
}

export interface DemoUiText {
  clickRole: string
  name: string
  purpose: string
  domain: string
  accountabilities: string
}

export interface DemoTexts {
  roles: Record<string, DemoRoleText>
  ui?: DemoUiText
}

// --- Roles ----------------------------------------------------------------

// Maps a role id to its translation key and visual/base settings. Text comes
// from DemoTexts.roles[key].
interface RoleSpec {
  id: string
  key: string
  base?: boolean
  hue?: number
}

const ROLE_SPECS: RoleSpec[] = [
  { id: 'role-nova', key: 'nova' },
  { id: 'role-product', key: 'product', hue: 210 },
  { id: 'role-design', key: 'design', hue: 320 },
  { id: 'role-dev', key: 'dev', hue: 150 },
  { id: 'role-business', key: 'business', hue: 40 },
  { id: 'role-leader', key: 'leader', base: true },
]

const ROLE_BASE = {
  orgId: ORG_ID,
  archived: false,
  base: false,
  purpose: '',
  domain: '',
  accountabilities: '',
  checklist: '',
  indicators: '',
  notes: '',
  singleMember: false,
  parentLink: false,
  colorHue: null as number | null,
}

function buildRoles(texts: DemoTexts): RoleFragment[] {
  return ROLE_SPECS.map((spec) => {
    const text = texts.roles[spec.key] ?? { name: spec.key }
    if (spec.base) {
      return {
        ...ROLE_BASE,
        id: spec.id,
        name: text.name,
        base: true,
        singleMember: true,
        parentLink: true,
        colorHue: 0,
      } as RoleFragment
    }
    return {
      ...ROLE_BASE,
      id: spec.id,
      name: text.name,
      purpose: text.purpose ?? '',
      domain: text.domain ?? '',
      accountabilities: text.accountabilities ?? '',
      colorHue: spec.hue ?? null,
    } as RoleFragment
  })
}

// --- Members --------------------------------------------------------------

// Proper names, identical across languages, so they stay out of i18n.
interface DemoMember {
  id: string
  name: string
  avatar: string
}

const DEMO_MEMBERS: DemoMember[] = [
  { id: 'member-alice', name: 'Alice', avatar: '/demo-avatars/alice.jpg' },
  { id: 'member-bruno', name: 'Bruno', avatar: '/demo-avatars/bruno.jpg' },
  { id: 'member-chloe', name: 'Chloé', avatar: '/demo-avatars/chloe.jpg' },
  { id: 'member-emma', name: 'Emma', avatar: '/demo-avatars/emma.jpg' },
  { id: 'member-tom', name: 'Tom', avatar: '/demo-avatars/tom.jpg' },
  { id: 'member-camille', name: 'Camille', avatar: '/demo-avatars/camille.jpg' },
]

// The member tied to the demo's mock logged-in user (so useCurrentMember
// resolves and edit permissions behave as in the app).
export const DEMO_USER_ID = 'demo-user'
const CURRENT_MEMBER_ID = 'member-alice'

function buildMembers(): MemberFragment[] {
  return DEMO_MEMBERS.map(
    (m) =>
      ({
        id: m.id,
        orgId: ORG_ID,
        name: m.name,
        description: '',
        picture: m.avatar,
        pictureFileId: null,
        userId: m.id === CURRENT_MEMBER_ID ? DEMO_USER_ID : null,
        inviteEmail: null,
        inviteDate: null,
        // Current member is an org owner so the demo can edit any member.
        role: m.id === CURRENT_MEMBER_ID ? ('Owner' as MemberFragment['role']) : null,
        archived: false,
      }) as MemberFragment
  )
}

// --- Circles --------------------------------------------------------------

// A circle for a "real" role, plus an optional Leader sub-circle holding the
// circle's leader member.
interface CircleSpec {
  id: string
  roleId: string
  parentId: string | null
  // member id of the leader (creates a Leader sub-circle with that member)
  leader?: string
  // direct members of the circle (besides the leader)
  members?: string[]
}

const CIRCLE_SPECS: CircleSpec[] = [
  { id: 'circle-nova', roleId: 'role-nova', parentId: null, leader: 'member-alice' },
  {
    id: 'circle-product',
    roleId: 'role-product',
    parentId: 'circle-nova',
  },
  {
    id: 'circle-dev',
    roleId: 'role-dev',
    parentId: 'circle-product',
    leader: 'member-bruno',
    members: ['member-tom', 'member-chloe'],
  },
  {
    id: 'circle-design',
    roleId: 'role-design',
    parentId: 'circle-product',
    leader: 'member-emma',
    members: ['member-alice'],
  },
  {
    id: 'circle-business',
    roleId: 'role-business',
    parentId: 'circle-nova',
    leader: 'member-camille',
    members: ['member-bruno'],
  },
]

function buildCircles(): {
  circles: CircleFragment[]
  circleMembers: CircleMemberFragment[]
} {
  const circles: CircleFragment[] = []
  const circleMembers: CircleMemberFragment[] = []
  const now = '2024-01-01T00:00:00.000Z'

  const addMember = (circleId: string, memberId: string) => {
    circleMembers.push({
      id: `cm-${circleId}-${memberId}`,
      orgId: ORG_ID,
      circleId,
      memberId,
      createdAt: now,
      archived: false,
    } as CircleMemberFragment)
  }

  for (const spec of CIRCLE_SPECS) {
    circles.push({
      id: spec.id,
      orgId: ORG_ID,
      roleId: spec.roleId,
      parentId: spec.parentId,
      archived: false,
    } as CircleFragment)

    for (const memberId of spec.members ?? []) addMember(spec.id, memberId)

    if (spec.leader) {
      const leaderCircleId = `${spec.id}-leader`
      circles.push({
        id: leaderCircleId,
        orgId: ORG_ID,
        roleId: 'role-leader',
        parentId: spec.id,
        archived: false,
      } as CircleFragment)
      addMember(leaderCircleId, spec.leader)
    }
  }

  return { circles, circleMembers }
}

// --- Public API -----------------------------------------------------------

// Subset of circles used for the simpler "circles and roles" illustration.
const SIMPLE_CIRCLE_IDS = new Set([
  'circle-nova',
  'circle-nova-leader',
  'circle-product',
  'circle-business',
  'circle-business-leader',
])

export interface DemoFragments {
  circles: CircleFragment[]
  circleMembers: CircleMemberFragment[]
  circleLinks: CircleLinkFragment[]
  roles: RoleFragment[]
  members: MemberFragment[]
}

// Raw fragments for a demo org (used to seed the editable proposal draft).
export function getDemoFragments(
  key: DemoOrgKey,
  texts: DemoTexts
): DemoFragments {
  const roles = buildRoles(texts)
  const members = buildMembers()
  let { circles, circleMembers } = buildCircles()

  if (key === 'simple') {
    circles = circles.filter((c) => SIMPLE_CIRCLE_IDS.has(c.id))
    const keptCircleIds = new Set(circles.map((c) => c.id))
    circleMembers = circleMembers.filter((cm) => keptCircleIds.has(cm.circleId))
  }

  return { circles, circleMembers, circleLinks: [], roles, members }
}

// Indexed OrgData for a demo org (used by the read-only graph view).
export function getDemoOrgData(key: DemoOrgKey, texts: DemoTexts): OrgData {
  const { circles, circleMembers, circleLinks, roles, members } =
    getDemoFragments(key, texts)
  return new OrgData(circles, circleMembers, circleLinks, roles, members)
}
