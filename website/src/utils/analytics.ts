// Umami analytics. The tracker is only loaded in production (see
// BaseLayout.astro), so every call here is a no-op in development.
//
// Naming convention: `domain_object_action`, snake_case, past tense once the
// action is done. Site events are prefixed `site_`. An event name that is a
// funnel step in Umami cannot be renamed without breaking the report.

import config from '../../website.config'

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

/** Current page language, as stamped on <html> by BaseLayout. */
export function currentLang(): string {
  return document.documentElement.lang
}

/**
 * Path without its language prefix, so the same page counts once across
 * locales: `/fr/docs/members` gives `/docs/members`. The language travels
 * separately, in the `lang` property.
 */
export function stripLang(path: string): string {
  const [, head, ...rest] = path.split('/')
  return (config.langs as readonly string[]).includes(head)
    ? '/' + rest.join('/')
    : path
}

/**
 * Section and slug of the current page: `/en/blog/my-post` gives
 * `{ section: 'blog', slug: 'my-post' }`. A page with no slug (`/fr/pricing`,
 * a section index) is a destination rather than something read through.
 */
export function currentPage(): { section: string; slug: string } {
  const [, section = '', ...rest] = stripLang(location.pathname).split('/')
  return { section, slug: rest.filter(Boolean).join('/') }
}
