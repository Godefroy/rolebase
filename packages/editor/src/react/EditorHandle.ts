import { Editor } from '@tiptap/core'
import { isEmptyJson } from '../markdown/isEmptyJson'

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
  return editor.isEmpty || isEmptyJson(editor.getJSON())
}
