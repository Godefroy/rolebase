import { FastifyReply, FastifyRequest } from 'fastify'
import { Context, createContext } from '../trpc/context'
import { captureError, startErrorHandling } from '../utils/sentry'

export type RouteFn = (context: Context) => any

export class RestError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message)
  }
}

export function route<F extends RouteFn>(routeFn: F) {
  return async (req: FastifyRequest, res: FastifyReply): Promise<void> => {
    const startTime = Date.now()
    const getDuration = () => Date.now() - startTime

    // Error handling
    const errorTransaction = startErrorHandling(req.url)

    const context = await createContext({
      req,
      res,
    })

    try {
      const result = await routeFn(context)
      res.status(200).send(result)
    } catch (error) {
      let status = 500
      let message = 'Internal Server Error'

      if (error instanceof RestError) {
        status = error.status
        message = error.message
      }

      if (status === 500) {
        console.log(
          `Error: ${
            (error as any)?.message || JSON.stringify(error)
          } (${getDuration()}ms)`
        )
        captureError(error as any)
      }

      res.status(status).send(message)
    } finally {
      errorTransaction.end()
    }
  }
}
