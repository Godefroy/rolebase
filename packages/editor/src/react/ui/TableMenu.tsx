import { Editor } from '@tiptap/core'
import React, { ReactNode } from 'react'
import {
  TbColumnInsertRight,
  TbColumnRemove,
  TbFreezeRow,
  TbRowInsertBottom,
  TbRowRemove,
  TbTableOff,
} from 'react-icons/tb'
import { EditorLabels } from '../labels'
import { BubbleMenu } from '../menusShim'

interface Props {
  editor: Editor
  labels: EditorLabels
}

export default function TableMenu({ editor, labels }: Props) {
  const buttons: Array<{
    key: string
    label: string
    icon: ReactNode
    onClick(): void
  }> = [
    {
      key: 'addRow',
      label: labels.addRowBelow,
      icon: <TbRowInsertBottom />,
      onClick: () => editor.chain().focus().addRowAfter().run(),
    },
    {
      key: 'addColumn',
      label: labels.addColumnRight,
      icon: <TbColumnInsertRight />,
      onClick: () => editor.chain().focus().addColumnAfter().run(),
    },
    {
      key: 'deleteRow',
      label: labels.deleteRow,
      icon: <TbRowRemove />,
      onClick: () => editor.chain().focus().deleteRow().run(),
    },
    {
      key: 'deleteColumn',
      label: labels.deleteColumn,
      icon: <TbColumnRemove />,
      onClick: () => editor.chain().focus().deleteColumn().run(),
    },
    {
      key: 'toggleHeader',
      label: labels.toggleHeaderRow,
      icon: <TbFreezeRow />,
      onClick: () => editor.chain().focus().toggleHeaderRow().run(),
    },
    {
      key: 'deleteTable',
      label: labels.deleteTable,
      icon: <TbTableOff />,
      onClick: () => editor.chain().focus().deleteTable().run(),
    },
  ]

  return (
    <BubbleMenu
      editor={editor}
      shouldShow={({ editor, state }) =>
        editor.isEditable && state.selection.empty && editor.isActive('table')
      }
    >
      <div className="editor-toolbar">
        {buttons.map((button) => (
          <button
            key={button.key}
            type="button"
            title={button.label}
            aria-label={button.label}
            onMouseDown={(event) => {
              event.preventDefault()
              button.onClick()
            }}
          >
            {button.icon}
          </button>
        ))}
      </div>
    </BubbleMenu>
  )
}
