import { router } from '../../trpc'
import deleteOrg from './deleteOrg'
import deleteUser from './deleteUser'
import getOrgDeletionPreview from './getOrgDeletionPreview'
import getUserDeletionPreview from './getUserDeletionPreview'
import impersonate from './impersonate'

export default router({
  deleteOrg,
  deleteUser,
  getOrgDeletionPreview,
  getUserDeletionPreview,
  impersonate,
})
