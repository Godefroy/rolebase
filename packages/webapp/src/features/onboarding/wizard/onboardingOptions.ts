// Predefined onboarding choices. Labels are resolved from i18n in the step
// components, keyed by these values (`Onboarding.options.<group>.<value>`).
// Declared `as const` so the value unions compose into valid typed i18n keys.
// Selecting "other" reveals a free-text input whose content becomes the
// submitted value.

export const OTHER_VALUE = 'other'

export const ROLE_OPTIONS = [
  'executive',
  'manager',
  'hr',
  'coach',
  'operations',
  'other',
] as const

export const OBJECTIVE_OPTIONS = [
  'clarify_roles',
  'structure_org',
  'governance',
  'meetings',
  'collaboration',
  'other',
] as const

export const SOURCE_OPTIONS = [
  'search',
  'social',
  'word_of_mouth',
  'blog',
  'ai',
  'event',
  'other',
] as const

export type RoleOption = (typeof ROLE_OPTIONS)[number]
export type ObjectiveOption = (typeof OBJECTIVE_OPTIONS)[number]
export type SourceOption = (typeof SOURCE_OPTIONS)[number]
