export interface TocItem {
  slug: string
  text: string
}

export interface Heading {
  depth: number
  slug: string
  text: string
}

// Strip a leading list number (e.g. "1. ", "2) ", "3 - ") so the table of
// contents reads cleanly even when headings are manually numbered.
function stripLeadingNumber(text: string) {
  return text.replace(/^\d+\s*[)/\-.·•]\s*/, '')
}

// Shared table-of-contents source: keep level-2 headings only and clean them up.
export function getTocItems(headings: Heading[]): TocItem[] {
  return headings
    .filter((h) => h.depth === 2)
    .map((h) => ({ slug: h.slug, text: stripLeadingNumber(h.text) }))
}
