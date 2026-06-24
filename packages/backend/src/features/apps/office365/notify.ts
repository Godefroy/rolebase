import { ChangeNotification } from '@microsoft/microsoft-graph-types-beta'
import { loadAppById } from '..'
import { RestError, route } from '../../../rest/route'
import { captureError } from '../../../utils/sentry'
import { handleAppSyncError } from '../AppDisconnectedError'
import Office365App from './Office365App'

export default route(async (context) => {
  const query: Record<string, any> = context.req.query || {}
  const body: Record<string, any> = context.req.body || {}

  // Validate request on subscription creation
  if (query?.validationToken) {
    return query.validationToken
  }

  const notifications = body?.value as ChangeNotification[]
  if (!Array.isArray(notifications)) {
    throw new RestError(
      400,
      `body.value is not an array. body=${JSON.stringify(body)}`
    )
  }

  for (const notification of notifications) {
    let app: Office365App | undefined
    try {
      const {
        subscriptionId,
        clientState: userAppId,
        changeType,
        resourceData,
        lifecycleEvent,
      } = notification

      if (!userAppId) {
        throw new Error('Missing clientState (userAppId)')
      }
      if (!subscriptionId) {
        throw new Error('Missing subscriptionId')
      }

      // Load user app
      const loadedApp = await loadAppById(userAppId)
      if (!(loadedApp instanceof Office365App)) {
        return
      }
      app = loadedApp

      // Lifecycle notification
      if (lifecycleEvent === 'missed') {
        // Reset subscription and stop here
        await app.onSubscriptionMissed(subscriptionId)
        break
      } else if (lifecycleEvent === 'reauthorizationRequired') {
        await app.onSubscriptionReauthorizationRequired(subscriptionId)
      } else if (lifecycleEvent === 'subscriptionRemoved') {
        // Reset subscription and stop here
        await app.onSubscriptionRemoved(subscriptionId)
        break
      } else if (subscriptionId && changeType && resourceData) {
        // Event notification
        const { id, '@odata.type': type } = resourceData as any

        if (type !== '#Microsoft.Graph.Event') {
          continue
        }

        if (changeType === 'created') {
          await app.onEventCreated(id, subscriptionId)
        } else if (changeType === 'updated') {
          await app.onEventUpdated(id, subscriptionId)
        } else if (changeType === 'deleted') {
          await app.onEventDeleted(id, subscriptionId)
        } else {
          throw new Error(`Invalid changeType "${changeType}"`)
        }
      }
    } catch (error) {
      console.error(`[Error] ${error}`)
      if (app) {
        await handleAppSyncError(error, app)
      } else {
        captureError(error as any)
      }
    }
  }

  // Should always return 202 to avoid retry
  throw new RestError(202, 'Accepted')
})
