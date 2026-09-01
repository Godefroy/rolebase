import {
  currentLang,
  currentPage,
  stripLang,
  track,
  type TrackProps,
} from '../utils/analytics'

export {}

// Call-to-action clicks. Every button on the site goes through Button.astro,
// which stamps `data-track` on its link, so one delegated listener covers the
// whole site (MDX content included) without a single call site to maintain.
//
// One rule, applied to the link and to its enclosing tracking context: a
// `data-track-<name>` attribute becomes the `<name>` property of the event. A
// section that needs its own event declares `data-track-event` on a wrapper, so
// nothing page-specific is known here.
document.addEventListener('click', (event) => {
  const target = event.target as HTMLElement | null
  const el = target?.closest<HTMLAnchorElement>('a[data-track]')
  if (!el) return

  const context = el.closest<HTMLElement>('[data-track-event]')
  const name = context?.dataset.trackEvent || el.dataset.track
  if (!name) return

  track(name, {
    ...trackProps(context),
    ...trackProps(el),
    target: targetOf(el),
    page: location.pathname,
    lang: currentLang(),
  })
})

/** `data-track-plan="small"` on `el` becomes `{ plan: 'small' }`. */
function trackProps(el: HTMLElement | null): TrackProps {
  if (!el) return {}
  return Object.fromEntries(
    Object.entries(el.dataset)
      .filter(
        ([key]) =>
          key.startsWith('track') && key !== 'track' && key !== 'trackEvent'
      )
      .map(([key, value]) => [key[5].toLowerCase() + key.slice(6), value])
  )
}

/**
 * Where the link goes. The destination is a fact, unlike an intent guessed
 * from it: a renamed path shows up as a new value in the report instead of
 * silently falling into a default. External links report their host.
 */
function targetOf(el: HTMLAnchorElement): string {
  const href = el.getAttribute('href') ?? ''
  if (/^https?:/.test(href)) return new URL(href).hostname
  return stripLang(href.split(/[?#]/)[0]) || '/'
}

// Read-through: which pages are read rather than merely opened. Fired once, at
// 75% of a page long enough to be scrolled. The section travels as a property,
// so a new content collection is covered without a change here, and a page with
// no slug (a section index, /fr/pricing) stays out: it is a destination, not
// something one reads to the end.
const { section, slug } = currentPage()

if (slug) {
  let sent = false
  const onScroll = () => {
    if (sent) return
    const height = document.documentElement.scrollHeight
    // Nothing to read through on a page that fits in the viewport.
    if (height <= window.innerHeight) return
    if ((window.scrollY + window.innerHeight) / height < 0.75) return
    sent = true
    window.removeEventListener('scroll', onScroll)
    track('site_page_read', { section, slug, lang: currentLang() })
  }
  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()
}
