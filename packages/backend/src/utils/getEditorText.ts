import { mdToText } from '@rolebase/editor'
import { exportToMarkdown } from '@rolebase/editor-legacy'

// Extract plain text from editor content (for search indexing, AI, etc.)
// Values are markdown since the editor migration. Legacy Lexical JSON
// (starting with '{') can still appear until the conversion is re-run:
// it is rendered to markdown with the legacy editor first.
export default function getEditorText(
  value: string | undefined | null
): string {
  if (!value) return ''
  return mdToText(exportToMarkdown(value))
}
