import { router } from '../../trpc'
import acceptMemberInvitation from './acceptMemberInvitation'
import archiveMember from './archiveMember'
import getMemberInvitationInfo from './getMemberInvitationInfo'
import inviteMember from './inviteMember'
import restoreMember from './restoreMember'
import updateMemberRole from './updateMemberRole'

export default router({
  acceptMemberInvitation,
  archiveMember,
  getMemberInvitationInfo,
  inviteMember,
  restoreMember,
  updateMemberRole,
})
