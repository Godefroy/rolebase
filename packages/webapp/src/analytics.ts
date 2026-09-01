// Umami analytics. The tracker is only loaded on rolebase.io (see index.html),
// so every call here is a no-op in development and on previews.
//
// Naming convention: `domain_object_action`, snake_case, past tense once the
// action is done (`subscription_plan_selected`). The domain matches the webapp
// feature folder. An event name that is a funnel step in Umami cannot be
// renamed without breaking the report.

export type TrackProps = Record<
  string,
  string | number | boolean | undefined | null
>

declare global {
  interface Window {
    umami?: {
      track(name: string, data?: TrackProps): void
      identify(data: TrackProps): void
    }
  }
}

// Umami rejects null values, and empty strings only add noise to the reports.
function clean(props?: TrackProps): TrackProps | undefined {
  if (!props) return undefined
  const entries = Object.entries(props).filter(
    ([, value]) => value !== undefined && value !== null && value !== ''
  )
  return entries.length ? Object.fromEntries(entries) : undefined
}

export function track(name: string, props?: TrackProps) {
  window.umami?.track(name, clean(props))
}

// Attaches durable attributes to the session, so any funnel can be replayed
// filtered by plan, org type or the profile declared during onboarding.
export function identify(props: TrackProps) {
  window.umami?.identify(clean(props) ?? {})
}
