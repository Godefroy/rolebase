import { useEffect } from 'react'

export default function useOverflowHidden(enabled = true) {
  useEffect(() => {
    if (!enabled) return
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [enabled])
}
