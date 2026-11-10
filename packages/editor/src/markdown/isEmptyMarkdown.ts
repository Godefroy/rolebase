// Check if a markdown string represents an empty document
export function isEmptyMarkdown(markdown: string | undefined | null): boolean {
  if (!markdown) return true
  return markdown.replace(/&nbsp;|\u00a0/g, '').trim().length === 0
}
