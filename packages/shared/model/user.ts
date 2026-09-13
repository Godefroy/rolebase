export interface UserMetadata {
  timezone?: string
  calendarShowWeekend?: boolean
  ratedApp?: boolean
  // RRULE of digsst or false if disabled
  digestRrule?: string | false
  // Date of last digest
  digestLastDate?: string
  // Onboarding profile answers (stats)
  onboardingRole?: string
  onboardingObjective?: string
  onboardingSource?: string
  // First display of the onboarding wizard, so its start is tracked once
  onboardingStartedAt?: string
  // Onboarding reminder emails already sent (ISO dates)
  onboardingReminders?: {
    noOrg?: string
    noInvite?: string
  }
}
