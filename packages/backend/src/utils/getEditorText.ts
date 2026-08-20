import { mdToText } from '@rolebase/editor'

// Extract plain text from editor content (for search indexing, AI, etc.)
export default function getEditorText(
  value: string | undefined | null
): string {
  if (!value) return ''
  return mdToText(value)
}
