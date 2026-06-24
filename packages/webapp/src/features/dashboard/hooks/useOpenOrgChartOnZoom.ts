import { useNavigateOrg } from '@/org/hooks/useNavigateOrg'
import { RefObject, useEffect } from 'react'

// The dashboard chart has panzoom disabled. A zoom gesture opens the full,
// interactive org chart where the user can actually zoom:
// - Desktop: ctrl/⌘ + wheel, or a trackpad pinch (fires wheel with ctrlKey).
// - Android/Chrome Blink: a two-finger pinch (multi-touch touchstart).
// - iOS Safari/Chrome: the non-standard `gesturestart` event (iOS drives
//   pinch-zoom through gesture events and ignores `user-scalable=no`).
// Registered as native non-passive listeners so we can preventDefault and
// block the browser's native page zoom (React's onWheel/onTouch are passive).
export function useOpenOrgChartOnZoom(ref: RefObject<HTMLElement>) {
  const navigateOrg = useNavigateOrg()

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const handleWheel = (event: WheelEvent) => {
      if (event.ctrlKey || event.metaKey) {
        event.preventDefault()
        navigateOrg('roles')
      }
    }

    // A pinch starts with a second finger touching down.
    const handleTouchStart = (event: TouchEvent) => {
      if (event.touches.length >= 2) {
        event.preventDefault()
        navigateOrg('roles')
      }
    }

    const handleGestureStart = (event: Event) => {
      event.preventDefault()
      navigateOrg('roles')
    }

    element.addEventListener('wheel', handleWheel, { passive: false })
    element.addEventListener('touchstart', handleTouchStart, { passive: false })
    element.addEventListener('gesturestart', handleGestureStart, {
      passive: false,
    })
    return () => {
      element.removeEventListener('wheel', handleWheel)
      element.removeEventListener('touchstart', handleTouchStart)
      element.removeEventListener('gesturestart', handleGestureStart)
    }
  }, [ref, navigateOrg])
}
