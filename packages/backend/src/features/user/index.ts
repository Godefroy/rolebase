import { registerRestRoutes } from '../../rest/registerRestRoutes'
import { router } from '../../trpc'
import brevoWebhook from './brevoWebhook'
import checkEmailDelivery from './checkEmailDelivery'
import checkEmailDomain from './checkEmailDomain'
import deleteAccount from './deleteAccount'
import getDeletionPreview from './getDeletionPreview'

export default router({
  checkEmailDelivery,
  checkEmailDomain,
  deleteAccount,
  getDeletionPreview,
})

registerRestRoutes((app) => {
  app.post('/user/brevoWebhook', brevoWebhook)
})
