import { router } from '../../trpc'
import deleteOrg from './deleteOrg'
import deleteUser from './deleteUser'
import getUserDeletionPreview from './getUserDeletionPreview'
import impersonate from './impersonate'
import restoreOrg from './restoreOrg'
import setUserDisabled from './setUserDisabled'

export default router({
  deleteOrg,
  deleteUser,
  getUserDeletionPreview,
  impersonate,
  restoreOrg,
  setUserDisabled,
})
