import {
  ThreadFragment,
  Thread_Status_Enum,
  useUpdateThreadMutation,
} from '@gql'
import { useCallback, useEffect, useState } from 'react'

export default function useThreadStatus(thread?: ThreadFragment) {
  const [updateThread] = useUpdateThreadMutation()

  const status: Thread_Status_Enum | undefined = thread?.status || undefined
  const [cachedStatus, setCachedStatus] = useState(status)

  useEffect(() => {
    if (!status) return
    setCachedStatus(status)
  }, [status])

  // Set thread status value
  const setStatus = useCallback(
    async (value: Thread_Status_Enum) => {
      if (!thread) return

      // Update local state
      setCachedStatus(value)

      // Update remote state
      updateThread({
        variables: {
          id: thread.id,
          values: {
            status: value,
          },
        },
      })
    },
    [thread]
  )

  return {
    threadStatus: cachedStatus,
    setStatus,
  }
}
