import { router } from '../../trpc'
import onVote from './onVote'
import resolve from './resolve'

export default router({
  onVote,
  resolve,
})
