// Example "main roles" offered during onboarding. Labels resolve from i18n
// (`Onboarding.roleExamples.*`); declared `as const` so the value union
// composes into valid typed keys.
export const MAIN_ROLE_EXAMPLES = [
  'direction',
  'tech',
  'production',
  'product',
  'business',
  'marketing',
  'sales',
  'admin',
  'finance',
  'hr',
] as const

export type MainRoleExample = (typeof MAIN_ROLE_EXAMPLES)[number]
