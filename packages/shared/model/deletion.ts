// Archived orgs are deleted for good after this delay
export const archivedOrgRetentionDays = 30

export function getOrgPurgeDate(archivedAt: string | Date): Date {
  const date = new Date(archivedAt)
  date.setDate(date.getDate() + archivedOrgRetentionDays)
  return date
}
