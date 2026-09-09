import type {
  CircleFragment,
  CircleLinkFragment,
  CircleMemberFragment,
  MemberFragment,
  RoleFragment,
} from '@rolebase/shared/gql'
import { Governance_Mode_Enum } from '@rolebase/shared/gql'
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

export type DemoOrgKey = 'demo' | 'simple' | 'classic'

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

// Labels of the org chart view tabs (Circles / Tree / Members)
export interface DemoViewsText {
  circles: string
  tree: string
  members: string
}

export interface DemoTexts {
  roles: Record<string, DemoRoleText>
  ui?: DemoUiText
  views: DemoViewsText
}

// --- Roles ----------------------------------------------------------------

// Maps a role id to its translation key and visual/base settings. Text comes
// from DemoTexts.roles[key].
interface RoleSpec {
  id: string
  key: string
  // Represents its circle to the parent circle: stacked under its parent card
  // in the tree view, and held by a single member
  parentLink?: boolean
  // Reusable role definition shared by several circles (e.g. Leader)
  base?: boolean
  hue?: number
}

const ROLE_SPECS: RoleSpec[] = [
  { id: 'role-nova', key: 'nova' },
  { id: 'role-product', key: 'product', hue: 210 },
  { id: 'role-design', key: 'design', hue: 320 },
  { id: 'role-dev', key: 'dev', hue: 150 },
  { id: 'role-business', key: 'business', hue: 40 },
  { id: 'role-leader', key: 'leader', base: true, parentLink: true },
]

// A classic company org chart, used to illustrate the hierarchical tree view:
// departments and teams, each led by a named director rather than a generic
// Leader role.
const CLASSIC_ROLE_SPECS: RoleSpec[] = [
  { id: 'role-company', key: 'nova' },
  { id: 'role-tech', key: 'tech', hue: 210 },
  { id: 'role-sales', key: 'sales', hue: 40 },
  { id: 'role-engineering', key: 'engineering', hue: 150 },
  { id: 'role-infra', key: 'infra', hue: 190 },
  { id: 'role-field', key: 'field', hue: 20 },
  { id: 'role-marketing', key: 'marketing', hue: 320 },
  { id: 'role-ceo', key: 'ceo', parentLink: true },
  { id: 'role-cto', key: 'cto', parentLink: true },
  { id: 'role-csales', key: 'csales', parentLink: true },
  { id: 'role-cfinance', key: 'cfinance', hue: 280 },
]

const ROLE_BASE = {
  orgId: ORG_ID,
  archivedAt: null,
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

function buildRoles(texts: DemoTexts, specs: RoleSpec[]): RoleFragment[] {
  return specs.map((spec) => {
    const text = texts.roles[spec.key] ?? { name: spec.key }
    return {
      ...ROLE_BASE,
      id: spec.id,
      name: text.name,
      purpose: text.purpose ?? '',
      domain: text.domain ?? '',
      accountabilities: text.accountabilities ?? '',
      base: spec.base ?? false,
      singleMember: spec.parentLink ?? false,
      parentLink: spec.parentLink ?? false,
      colorHue: spec.hue ?? (spec.parentLink ? 0 : null),
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
  {
    id: 'member-camille',
    name: 'Camille',
    avatar: '/demo-avatars/camille.jpg',
  },
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
        role:
          m.id === CURRENT_MEMBER_ID
            ? ('Owner' as MemberFragment['role'])
            : null,
        archivedAt: null,
      }) as MemberFragment
  )
}

// --- Circles --------------------------------------------------------------

// A circle for a "real" role, plus an optional leader sub-circle holding the
// circle's leader member.
interface CircleSpec {
  id: string
  roleId: string
  parentId: string | null
  // member id of the leader (creates a leader sub-circle with that member)
  leader?: string
  // role of that leader sub-circle (defaults to the generic Leader role)
  leaderRoleId?: string
  // direct members of the circle (besides the leader)
  members?: string[]
}

const CIRCLE_SPECS: CircleSpec[] = [
  {
    id: 'circle-nova',
    roleId: 'role-nova',
    parentId: null,
    leader: 'member-alice',
  },
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

const CLASSIC_CIRCLE_SPECS: CircleSpec[] = [
  {
    id: 'circle-company',
    roleId: 'role-company',
    parentId: null,
    leader: 'member-alice',
    leaderRoleId: 'role-ceo',
  },
  {
    id: 'circle-tech',
    roleId: 'role-tech',
    parentId: 'circle-company',
    leader: 'member-bruno',
    leaderRoleId: 'role-cto',
  },
  {
    id: 'circle-engineering',
    roleId: 'role-engineering',
    parentId: 'circle-tech',
    members: ['member-tom'],
  },
  {
    id: 'circle-infra',
    roleId: 'role-infra',
    parentId: 'circle-tech',
    members: ['member-chloe'],
  },
  {
    id: 'circle-sales',
    roleId: 'role-sales',
    parentId: 'circle-company',
    leader: 'member-camille',
    leaderRoleId: 'role-csales',
  },
  {
    id: 'circle-field',
    roleId: 'role-field',
    parentId: 'circle-sales',
    members: ['member-emma'],
  },
  {
    id: 'circle-marketing',
    roleId: 'role-marketing',
    parentId: 'circle-sales',
    members: ['member-alice'],
  },
  {
    id: 'circle-finance',
    roleId: 'role-cfinance',
    parentId: 'circle-company',
    members: ['member-chloe'],
  },
]

function buildCircles(specs: CircleSpec[]): {
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
      archivedAt: null,
    } as CircleMemberFragment)
  }

  for (const spec of specs) {
    circles.push({
      id: spec.id,
      orgId: ORG_ID,
      roleId: spec.roleId,
      parentId: spec.parentId,
      archivedAt: null,
    } as CircleFragment)

    for (const memberId of spec.members ?? []) addMember(spec.id, memberId)

    if (spec.leader) {
      const leaderCircleId = `${spec.id}-leader`
      circles.push({
        id: leaderCircleId,
        orgId: ORG_ID,
        roleId: spec.leaderRoleId ?? 'role-leader',
        parentId: spec.id,
        archivedAt: null,
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
  governanceMode: Governance_Mode_Enum
}

// Raw fragments for a demo org (used to seed the editable proposal draft).
export function getDemoFragments(
  key: DemoOrgKey,
  texts: DemoTexts
): DemoFragments {
  const classic = key === 'classic'
  const roles = buildRoles(texts, classic ? CLASSIC_ROLE_SPECS : ROLE_SPECS)
  const members = buildMembers()
  let { circles, circleMembers } = buildCircles(
    classic ? CLASSIC_CIRCLE_SPECS : CIRCLE_SPECS
  )

  if (key === 'simple') {
    circles = circles.filter((c) => SIMPLE_CIRCLE_IDS.has(c.id))
    const keptCircleIds = new Set(circles.map((c) => c.id))
    circleMembers = circleMembers.filter((cm) => keptCircleIds.has(cm.circleId))
  }

  // Free governance so the demo is fully editable by the current member.
  return {
    circles,
    circleMembers,
    circleLinks: [],
    roles,
    members,
    governanceMode: Governance_Mode_Enum.Free,
  }
}

// Indexed OrgData for a demo org (used by the read-only graph view).
export function getDemoOrgData(key: DemoOrgKey, texts: DemoTexts): OrgData {
  return new OrgData(getDemoFragments(key, texts))
}
