import { emailSchema } from '@rolebase/shared/schemas'

// Invitations typed at the setup's invite step are keyed by member id, or by
// this prefix for people who aren't members yet (created on send)
export const NEW_INVITE_PREFIX = 'new:'

export const isNewInvite = (id: string) => id.startsWith(NEW_INVITE_PREFIX)

// Invitations ready to send from the setup's invite step: typed emails that
// are valid addresses
export function getValidInvites(emails: Record<string, string>) {
  return Object.entries(emails)
    .map(([memberId, email]) => ({ memberId, email: email.trim() }))
    .filter(({ email }) => email !== '' && emailSchema.isValidSync(email))
}
