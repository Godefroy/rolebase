import { useEffect, useState } from 'react'

// Loads a deletion preview when the modal opens, and again when deps change.
// The previous preview stays displayed while the next one loads.
export default function useDeletionPreview<T>(
  load: () => Promise<T>,
  deps: React.DependencyList = []
) {
  const [preview, setPreview] = useState<T>()
  const [error, setError] = useState<Error>()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    load()
      .then((result) => !cancelled && setPreview(result))
      .catch((error) => !cancelled && setError(error))
      .finally(() => !cancelled && setLoading(false))
    return () => {
      cancelled = true
    }
  }, deps)

  return { preview, error, loading }
}
