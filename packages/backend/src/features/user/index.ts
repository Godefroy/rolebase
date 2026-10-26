import { router } from '../../trpc'
import checkEmailDomain from './checkEmailDomain'
import deleteAccount from './deleteAccount'
import getDeletionPreview from './getDeletionPreview'

export default router({
  checkEmailDomain,
  deleteAccount,
  getDeletionPreview,
})
