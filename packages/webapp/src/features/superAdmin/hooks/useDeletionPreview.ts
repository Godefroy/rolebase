import { useEffect, useState } from 'react'

// Loads a deletion preview once, when the modal opens
export default function useDeletionPreview<T>(load: () => Promise<T>) {
  const [preview, setPreview] = useState<T>()
  const [error, setError] = useState<Error>()

  useEffect(() => {
    load().then(setPreview).catch(setError)
  }, [])

  return { preview, error }
}
