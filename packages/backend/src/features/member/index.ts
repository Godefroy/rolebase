import { router } from '../../trpc'
import acceptMemberInvitation from './acceptMemberInvitation'
import archiveMember from './archiveMember'
import decideOrgAccessRequest from './decideOrgAccessRequest'
import getColleagueOrgs from './getColleagueOrgs'
import getMemberInvitationInfo from './getMemberInvitationInfo'
import getOrgAccessRequests from './getOrgAccessRequests'
import getPendingInvitations from './getPendingInvitations'
import inviteMember from './inviteMember'
import leaveOrg from './leaveOrg'
import requestOrgAccess from './requestOrgAccess'
import restoreMember from './restoreMember'
import updateMemberRole from './updateMemberRole'

export default router({
  acceptMemberInvitation,
  archiveMember,
  decideOrgAccessRequest,
  getColleagueOrgs,
  getMemberInvitationInfo,
  getOrgAccessRequests,
  getPendingInvitations,
  inviteMember,
  leaveOrg,
  requestOrgAccess,
  restoreMember,
  updateMemberRole,
})
