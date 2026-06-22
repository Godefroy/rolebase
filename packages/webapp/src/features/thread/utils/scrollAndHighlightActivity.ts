import { highlightElement } from '@utils/highlight'

// Scroll a thread activity to the center of the screen and briefly highlight
// it. Targets the activity container (not the offset scroll anchor) so the
// message is properly centered.
export function scrollAndHighlightActivity(activityId: string) {
  const anchor = document.getElementById(`activity-${activityId}`)
  const container =
    (anchor?.closest('[data-activity]') as HTMLElement | null) || anchor
  container?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  highlightElement(container)
}

// Extract an activity id from a URL hash like "#activity-{id}".
export function getActivityIdFromHash(hash: string): string | undefined {
  return hash.match(/^#activity-(.+)$/)?.[1]
}
