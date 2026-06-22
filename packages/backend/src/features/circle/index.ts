import { router } from '../../trpc'
import archiveCircle from './archiveCircle'
import restoreCircle from './restoreCircle'

export default router({
  archiveCircle,
  restoreCircle,
})
