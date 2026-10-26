import { router } from '../../trpc'
import createNextRecurringMeetings from './createNextRecurringMeetings'
import endOldMeetings from './endOldMeetings'
import purgeArchivedOrgs from './purgeArchivedOrgs'
import resendInvitations from './resendInvitations'
import resolveProposals from './resolveProposals'
import sendDigestEmails from './sendDigestEmails'
import sendOnboardingReminders from './sendOnboardingReminders'

export default router({
  createNextRecurringMeetings,
  endOldMeetings,
  purgeArchivedOrgs,
  resendInvitations,
  resolveProposals,
  sendDigestEmails,
  sendOnboardingReminders,
})
