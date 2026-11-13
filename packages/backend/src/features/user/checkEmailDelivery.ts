import * as yup from 'yup'
import { publicProcedure } from '../../trpc'
import { hasBounced } from './utils/emailBounces'

// Public: polled by the sign-in code step, before any session exists. It only
// tells whether the given address bounced since the code was sent, within the
// last hour, as reported by the Brevo webhook.
export default publicProcedure
  .input(
    yup.object().shape({
      email: yup.string().max(320).required(),
      since: yup.number().required(),
    })
  )
  .query(async (opts): Promise<{ bounced: boolean }> => {
    const { email, since } = opts.input
    return { bounced: hasBounced(email, since) }
  })
