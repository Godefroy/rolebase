/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { insertList, ListType } from '@lexical/list'
import {
  $convertFromMarkdownString,
  $convertToMarkdownString,
} from '@lexical/markdown'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { $rootTextContent } from '@lexical/text'
import {
  $createParagraphNode,
  $getRoot,
  $isParagraphNode,
  CLEAR_EDITOR_COMMAND,
  LexicalEditor,
} from 'lexical'
import { forwardRef, useImperativeHandle } from 'react'
import { markdownTransformers } from '@rolebase/editor-legacy'

export interface EditorHandle {
  editor: LexicalEditor
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

export default forwardRef<EditorHandle>(
  function EditorRefPlugin(props, ref): null {
    const [editor] = useLexicalComposerContext()

    // Get the current JSON state
    const getValue = (cleanEmpty?: boolean): string => {
      if (cleanEmpty && isEmpty()) {
        return ''
      }
      return JSON.stringify(editor.getEditorState().toJSON())
    }

    // Get the current text
    const getText = (): string => editor.getEditorState().read($rootTextContent)

    // Update value of editor without rendering the component
    const setValue = (value: string) => setEditorValue(editor, value)

    // Export state to markdown
    const exportMarkdown = () => {
      return editor
        .getEditorState()
        .read(() => $convertToMarkdownString(markdownTransformers))
    }

    // Set state from markdown
    const importMarkdown = (value: string) => {
      editor.update(() =>
        $convertFromMarkdownString(value, markdownTransformers)
      )
    }

    // Clear root
    const clear = () => editor.dispatchCommand(CLEAR_EDITOR_COMMAND, undefined)

    // Return true if root node is empty
    const isEmpty = (): boolean => {
      const empty = editor.getEditorState().read(() => {
        const root = $getRoot()

        // Root is empty
        if (root.isEmpty()) return true
        const children = root.getChildren()

        // Root has only one child and it's empty
        if (
          children.every(
            (node) =>
              $isParagraphNode(node) && node.getTextContent().trim() === ''
          )
        ) {
          return true
        }
        return false
      })
      return empty
    }

    // Add list at the end
    const addList = (type: ListType) => {
      editor.update(() => {
        const p = $createParagraphNode()
        $getRoot().append(p)
        insertList(editor, type)
        p.selectEnd()
      })
    }

    // Add bullet list at the end
    const addBulletList = () => addList('bullet')

    // Add checkbox at the end
    const addCheckboxList = () => addList('check')

    // Instance methods
    useImperativeHandle(
      ref,
      () => ({
        editor,
        getValue,
        getText,
        setValue,
        exportMarkdown,
        importMarkdown,
        isEmpty,
        clear,
        addBulletList,
        addCheckboxList,
      }),
      [editor]
    )

    return null
  }
)

export function setEditorValue(editor: LexicalEditor, value: string) {
  // JSON
  if (value[0] === '{') {
    const editorState = editor.parseEditorState(value)
    editor.setEditorState(editorState)
  } else {
    // Markdown
    editor.update(() => $convertFromMarkdownString(value, markdownTransformers))
  }
}
