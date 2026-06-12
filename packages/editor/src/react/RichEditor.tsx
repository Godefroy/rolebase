import { Editor, Extension } from '@tiptap/core'
import Collaboration from '@tiptap/extension-collaboration'
import CollaborationCaret from '@tiptap/extension-collaboration-caret'
import DragHandle from '@tiptap/extension-drag-handle-react'
import FileHandler from '@tiptap/extension-file-handler'
import { Placeholder } from '@tiptap/extensions'
import { EditorContent, ReactNodeViewRenderer, useEditor } from '@tiptap/react'
import React, {
  HTMLAttributes,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react'
import { MdDragIndicator } from 'react-icons/md'
import { WebsocketProvider } from 'y-websocket'
import { Doc } from 'yjs'
import { getExtensions } from '../extensions'
import { File } from '../extensions/File'
import { Mention, Mentionable } from '../extensions/Mention'
import { EditorHandle, isEmptyDoc } from './EditorHandle'
import { EmojiSuggestion } from './extensions/EmojiSuggestion'
import { SlashCommand } from './extensions/SlashCommand'
import { searchEmojis } from './emojiList'
import { EditorLabels, defaultLabels } from './labels'
import { filterSlashItems, getSlashItems } from './slashItems'
import { createSuggestionRender } from './suggestionRender'
import BubbleToolbar from './ui/BubbleToolbar'
import FileCard from './ui/FileCard'
import TableMenu from './ui/TableMenu'
import { EmojiMenu, MentionMenu, SlashMenu } from './ui/menus'
import { uploadAndInsert } from './upload'

export interface CollaborationConfig {
  // WebSocket server URL (y-websocket)
  url: string
  // Unique document identifier
  docId: string
  username?: string
  cursorColor?: string
  // Called when the connection + sync status changes
  onStatusChange?(online: boolean): void
}

export interface RichEditorProps
  extends Omit<
    HTMLAttributes<HTMLDivElement>,
    'onFocus' | 'onBlur' | 'onSubmit' | 'onChange'
  > {
  value?: string
  placeholder?: string
  emptyParagraphPlaceholder?: string
  readOnly?: boolean
  autoFocus?: boolean
  collaboration?: CollaborationConfig
  minH?: string
  maxH?: string
  mentionables?: Mentionable[]
  labels?: Partial<EditorLabels>
  onUpload?(file: globalThis.File): Promise<string>
  onChange?(): void
  onFocus?(): void
  onBlur?(): void
  onSubmit?(): void
}

export default forwardRef<EditorHandle, RichEditorProps>(function RichEditor(
  {
    value,
    placeholder,
    emptyParagraphPlaceholder,
    readOnly,
    autoFocus,
    collaboration,
    minH,
    maxH,
    mentionables,
    labels: labelsProp,
    onUpload,
    onChange,
    onFocus,
    onBlur,
    onSubmit,
    className,
    style,
    ...divProps
  },
  ref
) {
  const labels = useMemo(
    () => ({ ...defaultLabels, ...labelsProp }),
    [labelsProp]
  )

  // Keep changing props in refs so extensions can read fresh values
  // without being recreated
  const mentionablesRef = useRef(mentionables)
  mentionablesRef.current = mentionables
  const onUploadRef = useRef(onUpload)
  onUploadRef.current = onUpload
  const onSubmitRef = useRef(onSubmit)
  onSubmitRef.current = onSubmit
  const onChangeRef = useRef(onChange)
  onChangeRef.current = onChange
  const onFocusRef = useRef(onFocus)
  onFocusRef.current = onFocus
  const onBlurRef = useRef(onBlur)
  onBlurRef.current = onBlur
  const placeholderRef = useRef(placeholder)
  placeholderRef.current = placeholder
  const emptyParagraphPlaceholderRef = useRef(emptyParagraphPlaceholder)
  emptyParagraphPlaceholderRef.current = emptyParagraphPlaceholder
  const labelsRef = useRef(labels)
  labelsRef.current = labels

  const upload = (file: globalThis.File) =>
    onUploadRef.current?.(file) ?? Promise.resolve('')

  // Collaboration: Yjs document and provider, recreated when docId changes
  const collabDocId = collaboration?.docId
  const collab = useMemo(() => {
    if (!collaboration || !collabDocId) return undefined
    const doc = new Doc()
    const provider = new WebsocketProvider(
      collaboration.url,
      // Fresh rooms, separate from the legacy Lexical-based documents
      `${collabDocId}-v2`,
      doc,
      { connect: false }
    )
    return { doc, provider }
  }, [collabDocId])

  const [synced, setSynced] = useState(!collab)

  const editorRef = useRef<Editor | null>(null)

  const extensions = useMemo(() => {
    const result = [
      ...getExtensions({ collaboration: !!collab }).map((extension) => {
        // Render file attachments with a React card
        if (extension.name === 'file') {
          return File.extend({
            addNodeView: () => ReactNodeViewRenderer(FileCard),
          })
        }
        // Wire the mentions suggestion popup
        if (extension.name === 'mention') {
          return Mention.configure({
            suggestion: {
              char: '@',
              items: ({ query }) =>
                (mentionablesRef.current ?? [])
                  .filter((mentionable) =>
                    mentionable.name
                      .toLowerCase()
                      .includes(query.toLowerCase())
                  )
                  .slice(0, 8),
              render: createSuggestionRender(
                MentionMenu,
                () => editorRef.current
              ),
              command: ({ editor, range, props }) => {
                const mentionable = props as unknown as Mentionable
                editor
                  .chain()
                  .focus()
                  .insertContentAt(range, [
                    {
                      type: 'mention',
                      attrs: {
                        id: mentionable.id,
                        label: mentionable.name,
                        entity: mentionable.entity,
                      },
                    },
                    { type: 'text', text: ' ' },
                  ])
                  .run()
              },
            },
          })
        }
        return extension
      }),
      Placeholder.configure({
        showOnlyCurrent: false,
        placeholder: ({ editor, node, hasAnchor }) => {
          if (editor.isEmpty) return placeholderRef.current ?? ''
          // Show the paragraph placeholder only where the cursor is
          if (node.type.name === 'paragraph' && hasAnchor) {
            return emptyParagraphPlaceholderRef.current ?? ''
          }
          return ''
        },
      }),
      SlashCommand.configure({
        suggestion: {
          items: ({ query }) =>
            filterSlashItems(
              getSlashItems(labelsRef.current, upload),
              query
            ),
          render: createSuggestionRender(SlashMenu, () => editorRef.current),
        },
      }),
      EmojiSuggestion.configure({
        suggestion: {
          items: ({ query }) => (query.length < 2 ? [] : searchEmojis(query)),
          render: createSuggestionRender(EmojiMenu, () => editorRef.current),
        },
      }),
      FileHandler.configure({
        onDrop: (editor, files, position) => {
          for (const file of files) {
            uploadAndInsert(editor, file, upload, position)
          }
        },
        onPaste: (editor, files) => {
          for (const file of files) {
            uploadAndInsert(editor, file, upload)
          }
        },
      }),
      Extension.create({
        name: 'submitShortcut',
        addKeyboardShortcuts() {
          return {
            'Mod-Enter': () => {
              onSubmitRef.current?.()
              return true
            },
          }
        },
      }),
      ...(collab
        ? [
            Collaboration.configure({ document: collab.doc }),
            CollaborationCaret.configure({
              provider: collab.provider,
              user: {
                name: collaboration?.username ?? '',
                color: collaboration?.cursorColor ?? '#888888',
              },
            }),
          ]
        : []),
    ]
    return result
  }, [collab])

  const editor = useEditor(
    {
      extensions,
      content: collab ? undefined : (value ?? ''),
      contentType: 'markdown',
      editable: !readOnly && !collab,
      autofocus: autoFocus && !collab ? 'end' : false,
      onFocus: () => onFocusRef.current?.(),
      onBlur: () => onBlurRef.current?.(),
      onUpdate: () => onChangeRef.current?.(),
    },
    [collab]
  )

  editorRef.current = editor

  // Connect collaboration provider, seed initial content once
  useEffect(() => {
    if (!collab || !editor) return
    const { provider, doc } = collab
    let connected = false
    let isSynced = false

    const reportStatus = () => {
      collaboration?.onStatusChange?.(connected && isSynced)
    }

    const handleSynced = () => {
      if (!isSynced) {
        isSynced = true
        const fragment = doc.getXmlFragment('default')
        const meta = doc.getMap('meta')
        if (fragment.length === 0 && meta.get('seeded') !== true) {
          doc.transact(() => meta.set('seeded', true))
          if (value) {
            editor.commands.setContent(value, { contentType: 'markdown' })
          }
        }
        setSynced(true)
      }
      reportStatus()
    }

    const handleStatus = ({ status }: { status: string }) => {
      connected = status === 'connected'
      reportStatus()
    }

    provider.on('synced', handleSynced)
    provider.on('status', handleStatus)
    provider.connect()

    return () => {
      provider.off('synced', handleSynced)
      provider.off('status', handleStatus)
      provider.destroy()
      doc.destroy()
    }
  }, [collab, editor])

  // Update collaboration user info (member name can load after mount)
  useEffect(() => {
    if (!editor || !collab) return
    editor.commands.updateUser({
      name: collaboration?.username ?? '',
      color: collaboration?.cursorColor ?? '#888888',
    })
  }, [editor, collab, collaboration?.username, collaboration?.cursorColor])

  // Reflect readOnly and collaboration sync state on editability
  useEffect(() => {
    if (!editor) return
    const editable = !readOnly && (!collab || synced)
    if (editor.isEditable !== editable) {
      editor.setEditable(editable)
    }
  }, [editor, readOnly, collab, synced])

  // Focus once collaboration is ready
  useEffect(() => {
    if (autoFocus && collab && synced && editor) {
      editor.commands.focus('end')
    }
  }, [collab, synced, editor])

  // Controlled value: apply external changes when not focused
  useEffect(() => {
    if (!editor || collab || value === undefined) return
    if (editor.isFocused) return
    if (editor.getMarkdown() === value) return
    editor.commands.setContent(value, {
      contentType: 'markdown',
      emitUpdate: false,
    })
  }, [editor, value])

  // Instance methods
  useImperativeHandle(
    ref,
    (): EditorHandle => ({
      get editor() {
        return editorRef.current
      },
      getValue(cleanEmpty?: boolean) {
        const editor = editorRef.current
        if (!editor) return ''
        if (cleanEmpty && isEmptyDoc(editor)) return ''
        return editor.getMarkdown()
      },
      getText: () => editorRef.current?.getText() ?? '',
      setValue(value: string) {
        editorRef.current?.commands.setContent(value, {
          contentType: 'markdown',
        })
      },
      exportMarkdown() {
        return this.getValue()
      },
      importMarkdown(value: string) {
        this.setValue(value)
      },
      clear: () => {
        editorRef.current?.commands.clearContent(true)
      },
      isEmpty: () => {
        const editor = editorRef.current
        return editor ? isEmptyDoc(editor) : true
      },
      addBulletList: () => {
        editorRef.current?.chain().focus('end').toggleBulletList().run()
      },
      addCheckboxList: () => {
        editorRef.current?.chain().focus('end').toggleTaskList().run()
      },
    }),
    []
  )

  return (
    <div
      className={['editor', readOnly ? 'editor-readonly' : '', className ?? '']
        .filter(Boolean)
        .join(' ')}
      style={
        {
          ...style,
          '--editor-min-height': minH,
          '--editor-max-height': maxH,
        } as React.CSSProperties
      }
      {...divProps}
    >
      <EditorContent editor={editor} />
      {editor && !readOnly && (
        <>
          <BubbleToolbar editor={editor} labels={labels} />
          <TableMenu editor={editor} labels={labels} />
          <DragHandle editor={editor}>
            <div className="editor-drag-handle" contentEditable={false}>
              <MdDragIndicator />
            </div>
          </DragHandle>
        </>
      )}
    </div>
  )
})
