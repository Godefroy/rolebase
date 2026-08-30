import * as yup from 'yup'
import { RestError } from '../rest/route'
import { Context } from '../trpc/context'

export function guardQueryParams<Schema extends yup.Schema>(
  context: Context,
  schema: Schema
) {
  try {
    return schema.validateSync(context.req.query)
  } catch (error) {
    throw new RestError(400, 'Bad request')
  }
}
