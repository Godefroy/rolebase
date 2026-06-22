import { publicProcedure, router } from '../trpc'
import ai from './ai'
import apps from './apps'
import circle from './circle'
import cron from './cron'
import './graphql'
import meeting from './meeting'
import member from './member'
import org from './org'
import orgSubscription from './orgSubscription'
import participants from './participants'
import proposal from './proposal'
import search from './search'
import trigger from './trigger'

export const trpcRouter = router({
  ai,
  apps,
  circle,
  cron,
  meeting,
  member,
  org,
  orgSubscription,
  participants,
  proposal,
  search,
  trigger,

  // Health check for Nhost
  healthz: publicProcedure.query(() => 'ok'),
})

export type TrpcRouter = typeof trpcRouter
