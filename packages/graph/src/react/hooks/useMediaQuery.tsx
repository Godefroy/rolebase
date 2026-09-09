import { useEffect, useState } from 'react'

// Subscribe to a media query, so a resize or a rotation is caught
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia?.(query)?.matches === true
  )

  useEffect(() => {
    const list = window.matchMedia?.(query)
    if (!list) return
    const update = () => setMatches(list.matches)
    // Catch a change that happened between render and subscription
    update()
    list.addEventListener('change', update)
    return () => list.removeEventListener('change', update)
  }, [query])

  return matches
}
