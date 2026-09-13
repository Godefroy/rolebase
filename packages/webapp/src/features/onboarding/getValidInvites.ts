import { emailSchema } from '@rolebase/shared/schemas'

// Invitations ready to send from the setup's invite step: members whose typed
// email is a valid address
export function getValidInvites(emails: Record<string, string>) {
  return Object.entries(emails)
    .map(([memberId, email]) => ({ memberId, email: email.trim() }))
    .filter(({ email }) => email !== '' && emailSchema.isValidSync(email))
}
