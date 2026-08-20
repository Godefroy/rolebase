import { router } from '../../trpc'
import acceptMemberInvitation from './acceptMemberInvitation'
import archiveMember from './archiveMember'
import getMemberInvitationInfo from './getMemberInvitationInfo'
import getPendingInvitations from './getPendingInvitations'
import inviteMember from './inviteMember'
import restoreMember from './restoreMember'
import updateMemberRole from './updateMemberRole'

export default router({
  acceptMemberInvitation,
  archiveMember,
  getMemberInvitationInfo,
  getPendingInvitations,
  inviteMember,
  restoreMember,
  updateMemberRole,
})
