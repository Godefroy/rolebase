export interface UserMetadata {
  timezone?: string
  calendarShowWeekend?: boolean
  ratedApp?: boolean
  bookDemoInfo?: boolean
  // RRULE of digsst or false if disabled
  digestRrule?: string | false
  // Date of last digest
  digestLastDate?: string
  // Onboarding profile answers (stats)
  onboardingRole?: string
  onboardingObjective?: string
  onboardingSource?: string
}
