import { Editor } from '@tiptap/core'
import React, { ReactNode } from 'react'
import {
  FiCheckSquare,
  FiCode,
  FiGrid,
  FiImage,
  FiList,
  FiMinus,
  FiPaperclip,
  FiYoutube,
} from 'react-icons/fi'
import { MdFormatListNumbered, MdFormatQuote } from 'react-icons/md'
import { EditorLabels } from './labels'
import { pickFile, UploadFn, uploadAndInsert } from './upload'

export interface SlashCommandItem {
  key: string
  label: string
  icon: ReactNode
  keywords: string[]
  run(editor: Editor): void
}

export function getSlashItems(
  labels: EditorLabels,
  onUpload: UploadFn
): SlashCommandItem[] {
  return [
    {
      key: 'h1',
      label: labels.heading1,
      icon: <span className="editor-menu-icon-text">H1</span>,
      keywords: ['heading', 'title', 'h1'],
      run: (editor) =>
        editor.chain().focus().toggleHeading({ level: 1 }).run(),
    },
    {
      key: 'h2',
      label: labels.heading2,
      icon: <span className="editor-menu-icon-text">H2</span>,
      keywords: ['heading', 'subtitle', 'h2'],
      run: (editor) =>
        editor.chain().focus().toggleHeading({ level: 2 }).run(),
    },
    {
      key: 'h3',
      label: labels.heading3,
      icon: <span className="editor-menu-icon-text">H3</span>,
      keywords: ['heading', 'h3'],
      run: (editor) =>
        editor.chain().focus().toggleHeading({ level: 3 }).run(),
    },
    {
      key: 'bulletList',
      label: labels.bulletList,
      icon: <FiList />,
      keywords: ['list', 'bullet', 'ul'],
      run: (editor) => editor.chain().focus().toggleBulletList().run(),
    },
    {
      key: 'orderedList',
      label: labels.orderedList,
      icon: <MdFormatListNumbered />,
      keywords: ['list', 'numbered', 'ordered', 'ol'],
      run: (editor) => editor.chain().focus().toggleOrderedList().run(),
    },
    {
      key: 'taskList',
      label: labels.taskList,
      icon: <FiCheckSquare />,
      keywords: ['list', 'task', 'todo', 'checkbox', 'checklist'],
      run: (editor) => editor.chain().focus().toggleTaskList().run(),
    },
    {
      key: 'table',
      label: labels.table,
      icon: <FiGrid />,
      keywords: ['table'],
      run: (editor) =>
        editor
          .chain()
          .focus()
          .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
          .run(),
    },
    {
      key: 'quote',
      label: labels.quote,
      icon: <MdFormatQuote />,
      keywords: ['quote', 'blockquote'],
      run: (editor) => editor.chain().focus().toggleBlockquote().run(),
    },
    {
      key: 'codeBlock',
      label: labels.codeBlock,
      icon: <FiCode />,
      keywords: ['code'],
      run: (editor) => editor.chain().focus().toggleCodeBlock().run(),
    },
    {
      key: 'divider',
      label: labels.divider,
      icon: <FiMinus />,
      keywords: ['divider', 'separator', 'hr', 'rule'],
      run: (editor) => editor.chain().focus().setHorizontalRule().run(),
    },
    {
      key: 'image',
      label: labels.image,
      icon: <FiImage />,
      keywords: ['image', 'photo', 'picture', 'upload'],
      run: (editor) => {
        pickFile('image/*').then((file) => {
          if (file) uploadAndInsert(editor, file, onUpload)
        })
      },
    },
    {
      key: 'file',
      label: labels.file,
      icon: <FiPaperclip />,
      keywords: ['file', 'attachment', 'document', 'upload'],
      run: (editor) => {
        pickFile().then((file) => {
          if (file) uploadAndInsert(editor, file, onUpload)
        })
      },
    },
    {
      key: 'youtube',
      label: labels.youtube,
      icon: <FiYoutube />,
      keywords: ['youtube', 'video', 'embed'],
      run: (editor) => {
        const src = window.prompt(labels.youtubePrompt)
        if (src) {
          editor.chain().focus().setYoutubeVideo({ src }).run()
        }
      },
    },
  ]
}

export function filterSlashItems(
  items: SlashCommandItem[],
  query: string
): SlashCommandItem[] {
  const lowerQuery = query.toLowerCase()
  return items.filter(
    (item) =>
      item.label.toLowerCase().includes(lowerQuery) ||
      item.keywords.some((keyword) => keyword.startsWith(lowerQuery))
  )
}
