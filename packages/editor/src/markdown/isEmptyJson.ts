import { JSONContent } from '@tiptap/core'

// Check if a Tiptap JSON document is empty or contains only empty paragraphs
export function isEmptyJson(json: JSONContent): boolean {
  return (json.content ?? []).every(
    (node) =>
      node.type === 'paragraph' &&
      !(node.content ?? []).some(
        (child) => child.type !== 'text' || (child.text ?? '').trim() !== ''
      )
  )
}
