import { Editor } from '@tiptap/core'
import { useEditorState } from '@tiptap/react'
import { BubbleMenu } from '@tiptap/react/menus'
import React, { FormEvent, useEffect, useState } from 'react'
import {
  FiBold,
  FiCode,
  FiItalic,
  FiLink,
  FiTrash2,
  FiUnderline,
} from 'react-icons/fi'
import { MdStrikethroughS } from 'react-icons/md'
import { EditorLabels } from '../labels'

interface Props {
  editor: Editor
  labels: EditorLabels
}

export default function BubbleToolbar({ editor, labels }: Props) {
  const [linkEditing, setLinkEditing] = useState(false)
  const [linkValue, setLinkValue] = useState('')

  const state = useEditorState({
    editor,
    selector: ({ editor }) => ({
      bold: editor.isActive('bold'),
      italic: editor.isActive('italic'),
      underline: editor.isActive('underline'),
      strike: editor.isActive('strike'),
      code: editor.isActive('code'),
      link: editor.isActive('link'),
      linkHref: editor.getAttributes('link').href as string | undefined,
      selectionEmpty: editor.state.selection.empty,
    }),
  })

  // Reset link form when selection moves
  useEffect(() => {
    if (state.selectionEmpty) setLinkEditing(false)
  }, [state.selectionEmpty])

  const handleLinkSubmit = (event: FormEvent) => {
    event.preventDefault()
    const href = linkValue.trim()
    if (href) {
      editor.chain().focus().extendMarkRange('link').setLink({ href }).run()
    } else {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
    }
    setLinkEditing(false)
  }

  const buttons: Array<{
    key: string
    label: string
    icon: React.ReactNode
    active: boolean
    onClick(): void
  }> = [
    {
      key: 'bold',
      label: labels.bold,
      icon: <FiBold />,
      active: state.bold,
      onClick: () => editor.chain().focus().toggleBold().run(),
    },
    {
      key: 'italic',
      label: labels.italic,
      icon: <FiItalic />,
      active: state.italic,
      onClick: () => editor.chain().focus().toggleItalic().run(),
    },
    {
      key: 'underline',
      label: labels.underline,
      icon: <FiUnderline />,
      active: state.underline,
      onClick: () => editor.chain().focus().toggleUnderline().run(),
    },
    {
      key: 'strike',
      label: labels.strike,
      icon: <MdStrikethroughS />,
      active: state.strike,
      onClick: () => editor.chain().focus().toggleStrike().run(),
    },
    {
      key: 'code',
      label: labels.code,
      icon: <FiCode />,
      active: state.code,
      onClick: () => editor.chain().focus().toggleCode().run(),
    },
    {
      key: 'link',
      label: labels.link,
      icon: <FiLink />,
      active: state.link,
      onClick: () => {
        setLinkValue(state.linkHref ?? '')
        setLinkEditing(true)
      },
    },
  ]

  return (
    <BubbleMenu
      editor={editor}
      shouldShow={({ editor, state }) =>
        editor.isEditable &&
        !state.selection.empty &&
        !editor.isActive('codeBlock') &&
        !editor.isActive('image')
      }
    >
      <div className="editor-toolbar">
        {linkEditing ? (
          <form className="editor-toolbar-link" onSubmit={handleLinkSubmit}>
            <input
              autoFocus
              type="text"
              placeholder={labels.linkPlaceholder}
              value={linkValue}
              onChange={(event) => setLinkValue(event.target.value)}
            />
            {state.link && (
              <button
                type="button"
                title={labels.unlink}
                aria-label={labels.unlink}
                onMouseDown={(event) => {
                  event.preventDefault()
                  editor.chain().focus().extendMarkRange('link').unsetLink().run()
                  setLinkEditing(false)
                }}
              >
                <FiTrash2 />
              </button>
            )}
          </form>
        ) : (
          buttons.map((button) => (
            <button
              key={button.key}
              type="button"
              title={button.label}
              aria-label={button.label}
              className={button.active ? 'active' : undefined}
              onMouseDown={(event) => {
                event.preventDefault()
                button.onClick()
              }}
            >
              {button.icon}
            </button>
          ))
        )}
      </div>
    </BubbleMenu>
  )
}
