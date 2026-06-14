import { router } from '../../trpc'
import createNextRecurringMeetings from './createNextRecurringMeetings'
import endOldMeetings from './endOldMeetings'
import resendInvitations from './resendInvitations'
import resolveProposals from './resolveProposals'
import sendDigestEmails from './sendDigestEmails'

export default router({
  createNextRecurringMeetings,
  endOldMeetings,
  resendInvitations,
  resolveProposals,
  sendDigestEmails,
})
