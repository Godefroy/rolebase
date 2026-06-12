import { Editor, JSONContent } from '@tiptap/core'

export interface EditorHandle {
  editor: Editor | null
  getValue(cleanEmpty?: boolean): string
  getText(): string
  setValue(value: string): void
  exportMarkdown(): string
  importMarkdown(value: string): void
  clear(): void
  isEmpty(): boolean
  addBulletList(): void
  addCheckboxList(): void
}

// Return true if the document is empty or contains only empty paragraphs
export function isEmptyDoc(editor: Editor): boolean {
  if (editor.isEmpty) return true
  const json = editor.getJSON() as JSONContent
  return (json.content ?? []).every(
    (node) =>
      node.type === 'paragraph' &&
      !(node.content ?? []).some(
        (child) => child.type !== 'text' || (child.text ?? '').trim() !== ''
      )
  )
}
