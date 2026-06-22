// Highlights the table-of-contents link matching the heading currently scrolled
// into view.
export function initTocActive(): void {
  const nav = document.getElementById('toc-nav')
  if (!nav) return

  const links = nav.querySelectorAll<HTMLAnchorElement>('a[data-heading]')
  const slugs = Array.from(links).map((a) => a.dataset.heading!)
  const headings = slugs
    .map((s) => document.getElementById(s))
    .filter(Boolean) as HTMLElement[]
  if (headings.length === 0) return

  function updateActive() {
    let activeSlug = slugs[0]
    for (const heading of headings) {
      if (heading.getBoundingClientRect().top <= 100) {
        activeSlug = heading.id
      }
    }
    links.forEach((a) => {
      const active = a.dataset.heading === activeSlug
      a.classList.toggle('text-text-main', active)
      a.classList.toggle('font-medium', active)
      a.classList.toggle('text-text-secondary', !active)
    })
  }

  updateActive()
  document.addEventListener('scroll', updateActive, { passive: true })
}
