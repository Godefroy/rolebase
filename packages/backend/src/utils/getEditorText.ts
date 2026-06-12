import { mdToText } from '@rolebase/editor'
import getTextFromJSONEditor from './getTextFromJSONEditor'

// Extract plain text from editor content (for search indexing, AI, etc.)
// Values are markdown since the editor migration. Legacy Lexical JSON
// (starting with '{') can still appear until the conversion is re-run.
export default function getEditorText(
  value: string | undefined | null
): string {
  if (!value) return ''
  if (value[0] === '{') return getTextFromJSONEditor(value)
  return mdToText(value)
}
