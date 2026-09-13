import { Meeting_Step_Type_Enum } from '@gql'

// Organizational models offered during onboarding. The chosen value is stored
// on org.onboardingOrgType for stats only. Each model defines its base
// governance roles (created once for the org) and its meeting templates. No
// recurring meeting is seeded: scheduling one is part of the onboarding todo.
export enum OrgType {
  Classic = 'Classic',
  HolacracyV5 = 'HolacracyV5',
  HolacracyV4 = 'HolacracyV4',
  Sociocracy = 'Sociocracy',
}

// i18n key suffix for base role names (literal union so the composed
// `Onboarding.roles.*` key type-checks without a cast).
type RoleNameKey =
  | 'manager'
  | 'representative'
  | 'circleLead'
  | 'circleRep'
  | 'leadLink'
  | 'repLink'
  | 'leader'
  | 'delegate'
  | 'secretary'
  | 'facilitator'

// i18n key suffix for meeting template titles.
type MeetingTitleKey =
  | 'teamWeekly'
  | 'retrospective'
  | 'tactical'
  | 'governance'
  | 'operational'
  | 'policy'

export interface SeedBaseRole {
  nameKey: RoleNameKey
  colorHue: number
  parentLink?: boolean
}

export interface SeedMeetingTemplate {
  titleKey: MeetingTitleKey
  steps: Meeting_Step_Type_Enum[]
}

export interface OrgTypePreset {
  baseRoles: SeedBaseRole[]
  meetingTemplates: SeedMeetingTemplate[]
}

const Step = Meeting_Step_Type_Enum

const holacracyTemplates: SeedMeetingTemplate[] = [
  {
    titleKey: 'tactical',
    steps: [Step.Tour, Step.Checklist, Step.Indicators, Step.Tasks, Step.Threads],
  },
  {
    titleKey: 'governance',
    steps: [Step.Tour, Step.Threads],
  },
]

// Standard elected roles shared by Holacracy and Sociocracy circles
const secretary: SeedBaseRole = { nameKey: 'secretary', colorHue: 283 }
const facilitator: SeedBaseRole = { nameKey: 'facilitator', colorHue: 111 }

export const orgTypePresets: Record<OrgType, OrgTypePreset> = {
  [OrgType.Classic]: {
    baseRoles: [
      { nameKey: 'manager', colorHue: 0, parentLink: true },
      { nameKey: 'representative', colorHue: 18, parentLink: true },
    ],
    meetingTemplates: [
      {
        titleKey: 'teamWeekly',
        steps: [Step.Tour, Step.Tasks, Step.Threads],
      },
      {
        titleKey: 'retrospective',
        steps: [Step.Tour, Step.Threads],
      },
    ],
  },

  [OrgType.HolacracyV5]: {
    baseRoles: [
      { nameKey: 'circleLead', colorHue: 0, parentLink: true },
      { nameKey: 'circleRep', colorHue: 18, parentLink: true },
      secretary,
      facilitator,
    ],
    meetingTemplates: holacracyTemplates,
  },

  [OrgType.HolacracyV4]: {
    baseRoles: [
      { nameKey: 'leadLink', colorHue: 0, parentLink: true },
      { nameKey: 'repLink', colorHue: 18, parentLink: true },
      secretary,
      facilitator,
    ],
    meetingTemplates: holacracyTemplates,
  },

  [OrgType.Sociocracy]: {
    baseRoles: [
      { nameKey: 'leader', colorHue: 0, parentLink: true },
      { nameKey: 'delegate', colorHue: 18, parentLink: true },
      secretary,
      facilitator,
    ],
    meetingTemplates: [
      {
        titleKey: 'operational',
        steps: [Step.Tour, Step.Checklist, Step.Indicators, Step.Tasks, Step.Threads],
      },
      {
        titleKey: 'policy',
        steps: [Step.Tour, Step.Threads],
      },
    ],
  },
}

// The leader role of a model (the role the person responsible for a circle
// occupies): the first parent-linking base role.
export function getRepresentativeRole(orgType: OrgType): SeedBaseRole {
  const preset = orgTypePresets[orgType]
  return preset.baseRoles.find((r) => r.parentLink) ?? preset.baseRoles[0]
}

export const orgTypes = Object.values(OrgType)
