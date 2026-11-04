import { useAuth } from './useAuth'
import { useChangeMetadataMutation } from '@gql'
import { UserMetadata } from '@rolebase/shared/model/user'
import { useCallback, useEffect, useState } from 'react'
import { nhost } from 'src/nhost'

// Return current user metadata and a function to set a metadata by its key
export default function useUserMetadata() {
  const [updateMetadata] = useChangeMetadataMutation()

  // Get user metadata
  const { user } = useAuth()
  const userId = user?.id
  const metadata = user?.metadata as UserMetadata | undefined

  // Cache metadata for optimistic UI
  const [cachedMetadata, setCachedMetadata] = useState(metadata)

  useEffect(() => {
    if (!metadata) return
    setCachedMetadata(metadata)
  }, [metadata])

  // Set preference value
  const setMetadata = useCallback(
    async <Key extends keyof UserMetadata>(
      key: Key,
      value: UserMetadata[Key]
    ) => {
      if (!userId) return

      const newMetadata = {
        ...cachedMetadata,
        [key]: value,
      }

      // Update local state
      setCachedMetadata(newMetadata)

      // Update remote state
      await updateMetadata({
        variables: {
          userId,
          metadata: newMetadata,
        },
      })

      // Refresh user data
      await nhost.refreshSession(0)
    },
    [userId, cachedMetadata]
  )

  return {
    metadata: cachedMetadata,
    setMetadata,
  }
}
