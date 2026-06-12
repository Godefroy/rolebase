import { renderToHTMLString } from '@tiptap/static-renderer'
import { getExtensions } from '../extensions'
import { mdToJson } from './manager'

// Convert a markdown string to HTML (for emails, exports, etc.)
// Works on the server: no DOM needed.
export function mdToHtml(markdown: string): string {
  return renderToHTMLString({
    content: mdToJson(markdown),
    extensions: getExtensions(),
  })
}
