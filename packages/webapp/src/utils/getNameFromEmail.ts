// Suggested name from the email's local part: "jean.dupont" -> "Jean Dupont"
export function getNameFromEmail(email: string | undefined): string {
  const localPart = email?.split('@')[0] ?? ''
  return localPart
    .replace(/\+.*$/, '')
    .split(/[._-]+/)
    .map((word) => word.replace(/\d+/g, ''))
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
}
