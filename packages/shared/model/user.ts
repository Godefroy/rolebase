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
  // Guided tour of the org chart, by org id: started at the end of the org
  // setup, optionally continued with leaders and participants ("more"), then
  // completed or skipped
  orgChartTours?: Record<string, OrgChartTourStatus>
  // Onboarding reminder emails already sent (ISO dates)
  onboardingReminders?: {
    noOrg?: string
    noSetup?: string
    noInvite?: string
  }
}

export type OrgChartTourStatus = 'started' | 'more' | 'completed' | 'skipped'
