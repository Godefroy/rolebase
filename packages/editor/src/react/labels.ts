// UI labels with English defaults. The webapp can override them
// with translations through the `labels` prop of RichEditor.
export interface EditorLabels {
  // Slash menu
  heading1: string
  heading2: string
  heading3: string
  bulletList: string
  orderedList: string
  taskList: string
  table: string
  quote: string
  codeBlock: string
  divider: string
  image: string
  file: string
  youtube: string
  youtubePrompt: string
  // Bubble toolbar
  bold: string
  italic: string
  underline: string
  strike: string
  code: string
  link: string
  linkPlaceholder: string
  unlink: string
  // Table menu
  addRowBelow: string
  addColumnRight: string
  deleteRow: string
  deleteColumn: string
  toggleHeaderRow: string
  deleteTable: string
}

export const defaultLabels: EditorLabels = {
  heading1: 'Heading 1',
  heading2: 'Heading 2',
  heading3: 'Heading 3',
  bulletList: 'Bullet list',
  orderedList: 'Numbered list',
  taskList: 'Checklist',
  table: 'Table',
  quote: 'Quote',
  codeBlock: 'Code block',
  divider: 'Divider',
  image: 'Image',
  file: 'File',
  youtube: 'YouTube video',
  youtubePrompt: 'YouTube video URL',
  bold: 'Bold',
  italic: 'Italic',
  underline: 'Underline',
  strike: 'Strikethrough',
  code: 'Code',
  link: 'Link',
  linkPlaceholder: 'Paste a link…',
  unlink: 'Remove link',
  addRowBelow: 'Add row',
  addColumnRight: 'Add column',
  deleteRow: 'Delete row',
  deleteColumn: 'Delete column',
  toggleHeaderRow: 'Toggle header row',
  deleteTable: 'Delete table',
}
